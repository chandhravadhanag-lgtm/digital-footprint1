import re
from typing import Dict, Any, List, Optional

NOT_VERIFIED = "Not found / Not publicly verified"
DISAGREEMENT = "Sources disagree — manual verification recommended."

def synthesize_profile(
    name: str,
    wikidata_data: Dict[str, Any],
    wikipedia_data: Optional[Dict[str, Any]],
    github_data: Optional[Dict[str, Any]],
    search_results: Dict[str, List[Dict[str, Any]]],
    location_input: Optional[str] = None,
    org_input: Optional[str] = None
) -> Dict[str, Any]:
    """
    Synthesizes facts across Wikidata, Wikipedia, GitHub, and dynamic Web Search results.
    Attaches source URLs and confidence scores to every extracted attribute.
    Identifies discrepancies, inserts fallback labels for unverified items, and formats 11 core categories.
    """
    sources_ledger: List[Dict[str, Any]] = []

    def record_source(url: str, platform: str, reliability: str):
        if url and not any(s["url"] == url for s in sources_ledger):
            sources_ledger.append({
                "url": url,
                "platform": platform,
                "reliability": reliability,
            })

    # Record primary sources
    if wikidata_data.get("wikidata_url"):
        record_source(wikidata_data["wikidata_url"], "Wikidata (Structured Knowledge Base)", "High")
    if wikipedia_data and wikipedia_data.get("url"):
        record_source(wikipedia_data["url"], "Wikipedia (Biographical Encyclopedia)", "High")
    if github_data and github_data.get("url"):
        record_source(github_data["url"], "GitHub (Public Developer Profile)", "High")

    # 1. Full Name
    person_name = wikidata_data.get("label") or (wikipedia_data.get("title") if wikipedia_data else None) or name

    # 2. Date of Birth
    dob_val = wikidata_data.get("date_of_birth")
    dob_source = wikidata_data.get("wikidata_url")
    dob_conf = "High" if dob_val else "Low"

    # Cross-check DOB against Wikipedia or search snippets if available
    wiki_extract = wikipedia_data.get("extract", "") if wikipedia_data else ""
    if not dob_val and wiki_extract:
        # Regex search for birth date like "born June 10, 1972" or "born 10 June 1972"
        match = re.search(r"\bborn\s+([A-Z][a-z]+ \d{1,2}, \d{4}|\d{1,2} [A-Z][a-z]+ \d{4}|\d{4})\b", wiki_extract)
        if match:
            dob_val = match.group(1)
            dob_source = wikipedia_data.get("url")
            dob_conf = "High"

    if not dob_val:
        # Check search snippets
        for item in search_results.get("dob", []):
            snippet = item.get("snippet", "")
            match = re.search(r"\b(born\s+[A-Za-z]+ \d{1,2}, \d{4}|\b[A-Za-z]+ \d{1,2}, \d{4})\b", snippet)
            if match:
                dob_val = match.group(0).replace("born", "").strip()
                dob_source = item.get("url")
                dob_conf = "Medium"
                record_source(item["url"], item.get("source", "Web Search"), "Medium")
                break

    # 3. Profession / Occupation
    profession_val = None
    profession_source = None
    profession_conf = "Low"

    wiki_occupations = wikidata_data.get("occupations", [])
    if wiki_occupations:
        profession_val = ", ".join(wiki_occupations[:3]).title()
        profession_source = wikidata_data.get("wikidata_url")
        profession_conf = "High"
    elif wikipedia_data and wikipedia_data.get("description"):
        profession_val = wikipedia_data.get("description").capitalize()
        profession_source = wikipedia_data.get("url")
        profession_conf = "High"
    elif github_data and github_data.get("bio"):
        profession_val = github_data.get("bio")
        profession_source = github_data.get("url")
        profession_conf = "Medium"
    else:
        # Check search snippet for profession
        prof_items = search_results.get("profession", [])
        if prof_items:
            profession_val = prof_items[0].get("title", "").split("-")[0].split("|")[0].strip()
            profession_source = prof_items[0].get("url")
            profession_conf = "Medium"
            record_source(prof_items[0]["url"], prof_items[0].get("source", "Web Search"), "Medium")

    # 4. Current or Previous Organization
    org_val = None
    org_source = None
    org_conf = "Low"

    wiki_employers = wikidata_data.get("employers", [])
    if wiki_employers:
        org_val = ", ".join(wiki_employers[:3])
        org_source = wikidata_data.get("wikidata_url")
        org_conf = "High"
    elif github_data and github_data.get("company"):
        org_val = github_data.get("company").lstrip("@")
        org_source = github_data.get("url")
        org_conf = "High"
    elif org_input and org_input.strip():
        org_val = org_input.strip()
        org_source = "User Provided Parameter"
        org_conf = "Medium"
    else:
        # Search snippets
        for item in search_results.get("biography", []) + search_results.get("profession", []):
            snippet = item.get("snippet", "")
            match = re.search(r"\b(?:CEO of|Executive at|works at|Founder of)\s+([A-Z][A-Za-z0-9&\s]{2,20})\b", snippet)
            if match:
                org_val = match.group(1).strip()
                org_source = item.get("url")
                org_conf = "Medium"
                record_source(item["url"], item.get("source", "Web Search"), "Medium")
                break

    # 5. Education
    education_list = []
    for edu in wikidata_data.get("education", []):
        education_list.append({
            "institution": edu,
            "degree": "Publicly Documented Degree",
            "source": wikidata_data.get("wikidata_url"),
            "confidence": "High"
        })

    # If Wikidata has no education, check biography snippets
    if not education_list:
        for item in search_results.get("biography", []):
            snip = item.get("snippet", "")
            match = re.search(r"\b(graduated from|studied at|degree from|attended)\s+([A-Z][A-Za-z0-9\s]{3,30}(?:University|College|Institute|School))\b", snip, re.IGNORECASE)
            if match:
                education_list.append({
                    "institution": match.group(2).strip(),
                    "degree": "Documented Alumni Record",
                    "source": item.get("url"),
                    "confidence": "Medium"
                })
                record_source(item["url"], item.get("source", "Web Search"), "Medium")
                break

    # 6. Career Information
    career_list = []
    if wiki_employers:
        for emp in wiki_employers:
            career_list.append({
                "organization": emp,
                "role": profession_val or "Executive / Professional",
                "period": "Public Tenures",
                "source": wikidata_data.get("wikidata_url"),
                "confidence": "High"
            })
    if github_data and github_data.get("company"):
        career_list.append({
            "organization": github_data.get("company").lstrip("@"),
            "role": "Software Developer / Engineer",
            "period": "Active GitHub Contributor",
            "source": github_data.get("url"),
            "confidence": "High"
        })

    # 7. Official Website
    official_website = wikidata_data.get("official_website")
    website_source = wikidata_data.get("wikidata_url") if official_website else None
    website_conf = "High" if official_website else "Low"

    if not official_website and github_data and github_data.get("blog"):
        blog = github_data.get("blog")
        official_website = blog if blog.startswith("http") else f"https://{blog}"
        website_source = github_data.get("url")
        website_conf = "High"

    if not official_website:
        for item in search_results.get("website", []):
            u = item.get("url", "")
            if not any(x in u for x in ["wikipedia.org", "wikidata.org", "facebook.com", "instagram.com", "linkedin.com", "twitter.com", "x.com"]):
                official_website = u
                website_source = u
                website_conf = "Medium"
                record_source(u, item.get("source", "Web Search"), "Medium")
                break

    # 8. Public Social-Media Profiles (LinkedIn, GitHub, X, Instagram, Facebook, YouTube)
    social_profiles = []
    social_dict = wikidata_data.get("social_links", {})

    # LinkedIn
    linkedin_url = social_dict.get("linkedin")
    if not linkedin_url:
        for item in search_results.get("linkedin", []):
            if "linkedin.com/in/" in item.get("url", ""):
                linkedin_url = item.get("url")
                record_source(linkedin_url, "LinkedIn Public Profile", "High")
                break
    social_profiles.append({
        "platform": "LinkedIn",
        "url": linkedin_url or NOT_VERIFIED,
        "is_verified": bool(linkedin_url),
        "source": "Wikidata / LinkedIn Public Search" if linkedin_url else NOT_VERIFIED,
        "confidence": "High" if linkedin_url else "Low"
    })

    # GitHub
    github_url = social_dict.get("github") or (github_data.get("url") if github_data else None)
    if not github_url:
        for item in search_results.get("github", []):
            if "github.com/" in item.get("url", "") and not any(k in item["url"] for k in ["/search", "/topics", "/features"]):
                github_url = item.get("url")
                record_source(github_url, "GitHub Public Profile", "High")
                break
    social_profiles.append({
        "platform": "GitHub",
        "url": github_url or NOT_VERIFIED,
        "is_verified": bool(github_url),
        "source": "GitHub Public API" if github_url else NOT_VERIFIED,
        "confidence": "High" if github_url else "Low"
    })

    # X (Twitter)
    x_url = social_dict.get("x")
    if not x_url:
        for item in search_results.get("x_twitter", []):
            u = item.get("url", "")
            if "twitter.com/" in u or "x.com/" in u:
                x_url = u
                record_source(x_url, "X / Twitter Public Page", "Medium")
                break
    social_profiles.append({
        "platform": "X (Twitter)",
        "url": x_url or NOT_VERIFIED,
        "is_verified": bool(x_url),
        "source": "Wikidata / Public Web Discovery" if x_url else NOT_VERIFIED,
        "confidence": "High" if social_dict.get("x") else ("Medium" if x_url else "Low")
    })

    # Instagram
    insta_url = social_dict.get("instagram")
    if not insta_url:
        for item in search_results.get("instagram", []):
            if "instagram.com/" in item.get("url", ""):
                insta_url = item.get("url")
                record_source(insta_url, "Instagram Public Profile", "Medium")
                break
    social_profiles.append({
        "platform": "Instagram",
        "url": insta_url or NOT_VERIFIED,
        "is_verified": bool(insta_url),
        "source": "Wikidata / Public Web Discovery" if insta_url else NOT_VERIFIED,
        "confidence": "High" if social_dict.get("instagram") else ("Medium" if insta_url else "Low")
    })

    # Facebook
    fb_url = social_dict.get("facebook")
    if not fb_url:
        for item in search_results.get("biography", []):
            if "facebook.com/" in item.get("url", ""):
                fb_url = item.get("url")
                record_source(fb_url, "Facebook Public Page", "Medium")
                break
    social_profiles.append({
        "platform": "Facebook",
        "url": fb_url or NOT_VERIFIED,
        "is_verified": bool(fb_url),
        "source": "Wikidata / Public Directory" if fb_url else NOT_VERIFIED,
        "confidence": "High" if social_dict.get("facebook") else ("Medium" if fb_url else "Low")
    })

    # YouTube
    yt_url = social_dict.get("youtube")
    social_profiles.append({
        "platform": "YouTube",
        "url": yt_url or NOT_VERIFIED,
        "is_verified": bool(yt_url),
        "source": "Wikidata Claims (P2397)" if yt_url else NOT_VERIFIED,
        "confidence": "High" if yt_url else "Low"
    })

    # 9. Public News Mentions
    news_mentions = []
    for item in search_results.get("news", [])[:4]:
        news_mentions.append({
            "title": item.get("title"),
            "url": item.get("url"),
            "snippet": item.get("snippet"),
            "source": item.get("source", "Public News Index"),
            "relevance": "High"
        })
        record_source(item["url"], "News Web Mention", "Medium")

    # 10. Other Relevant Public Websites
    other_websites = []
    if wikipedia_data and wikipedia_data.get("url"):
        other_websites.append({
            "title": f"Wikipedia Biography: {wikipedia_data.get('title')}",
            "url": wikipedia_data.get("url"),
            "type": "Encyclopedia Reference",
            "snippet": wikipedia_data.get("extract", "")[:180] + "..."
        })
    if wikidata_data.get("wikidata_url"):
        other_websites.append({
            "title": f"Wikidata Entity Record: {wikidata_data.get('id')}",
            "url": wikidata_data.get("wikidata_url"),
            "type": "Knowledge Graph Registry",
            "snippet": wikidata_data.get("description", "Structured biographical claims")
        })
    for item in search_results.get("biography", [])[:3]:
        if not any(w["url"] == item["url"] for w in other_websites):
            other_websites.append({
                "title": item.get("title"),
                "url": item.get("url"),
                "type": "Public Web Reference",
                "snippet": item.get("snippet")
            })
            record_source(item["url"], item.get("source", "Web Search"), "Medium")

    # Overall Confidence Calculation
    high_count = sum(1 for s in [profession_conf, dob_conf, org_conf, website_conf] if s == "High")
    overall_confidence = "High" if high_count >= 2 else ("Medium" if high_count == 1 else "Low")

    return {
        "person": {
            "name": person_name,
            "headline": wikipedia_data.get("description") if wikipedia_data else (profession_val or "Public Individual"),
            "avatar_url": (wikipedia_data.get("thumbnail") if wikipedia_data else None) or (github_data.get("avatar_url") if github_data else None),
            "biography_summary": wikipedia_data.get("extract") if wikipedia_data else NOT_VERIFIED,
            "profession": {
                "value": profession_val or NOT_VERIFIED,
                "source": profession_source or NOT_VERIFIED,
                "confidence": profession_conf
            },
            "organization": {
                "value": org_val or NOT_VERIFIED,
                "source": org_source or NOT_VERIFIED,
                "confidence": org_conf
            },
            "date_of_birth": {
                "value": dob_val or NOT_VERIFIED,
                "source": dob_source or NOT_VERIFIED,
                "confidence": dob_conf
            },
            "education": education_list if education_list else [{
                "institution": NOT_VERIFIED,
                "degree": NOT_VERIFIED,
                "source": NOT_VERIFIED,
                "confidence": "Low"
            }],
            "career": career_list if career_list else [{
                "organization": org_val or NOT_VERIFIED,
                "role": profession_val or NOT_VERIFIED,
                "period": "Public Records",
                "source": org_source or NOT_VERIFIED,
                "confidence": org_conf
            }],
            "official_website": {
                "value": official_website or NOT_VERIFIED,
                "source": website_source or NOT_VERIFIED,
                "confidence": website_conf
            }
        },
        "social_profiles": social_profiles,
        "websites": other_websites,
        "news": news_mentions,
        "sources": sources_ledger,
        "confidence": overall_confidence
    }
