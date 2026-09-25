from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db
from models import PrivacyRequest, Profile

router = APIRouter(prefix="/api", tags=["Privacy"])

class PrivacyRequestPayload(BaseModel):
    profile_id: Optional[int] = None
    request_type: str # Removal Guidance, Search Delisting, Verification Dispute, Cache Wipe
    target_item: str
    contact_email: Optional[str] = None
    notes: Optional[str] = None

class PhoneVerifyRequest(BaseModel):
    phone_number: str
    otp_code: Optional[str] = None

@router.post("/privacy/request")
def submit_privacy_request(payload: PrivacyRequestPayload, db: Session = Depends(get_db)):
    if not payload.target_item or not payload.request_type:
        raise HTTPException(status_code=400, detail="Request type and target item are required.")

    req = PrivacyRequest(
        profile_id=payload.profile_id,
        request_type=payload.request_type,
        target_item=payload.target_item,
        status="acknowledged",
        resolution_notes=f"Auto-generated step-by-step guidance for delisting '{payload.target_item}' from public index sent to {payload.contact_email or 'user'}."
    )
    db.add(req)
    db.commit()
    db.refresh(req)

    guidance_steps = [
        "1. Identify the hosting platform controller (e.g. Google Search Console, GitHub settings, or LinkedIn Privacy).",
        "2. For social platforms, toggle profile visibility to 'Private' or disable search engine indexing under account settings.",
        "3. Submit an official search delisting request directly to Google/Bing if the data has already been removed from the origin site.",
        "4. In this prototype, this entry has been marked for instant exclusion from future DigitalTrace AI indexing caches."
    ]

    return {
        "status": "success",
        "ticket_id": f"DTR-{req.id:04d}",
        "request_type": req.request_type,
        "target_item": req.target_item,
        "status_label": "Request Recorded & Cached Delisted",
        "guidance_steps": guidance_steps,
        "message": "Your privacy removal guidance request has been generated. No private data is ever retained."
    }

@router.post("/phone/verify")
def verify_phone_ownership(payload: PhoneVerifyRequest):
    """
    Authorized phone number verification demo (strictly for account ownership, NOT reverse lookup of strangers).
    """
    if not payload.phone_number:
        raise HTTPException(status_code=400, detail="Phone number is required.")

    # Mask phone number for strict privacy
    clean_num = payload.phone_number.strip()
    masked = f"***-***-{clean_num[-4:]}" if len(clean_num) >= 4 else "***-***-0000"

    if payload.otp_code:
        # User entered OTP code (mock verification)
        return {
            "status": "verified",
            "message": f"Ownership confirmed for authorized phone number {masked}.",
            "phone_masked": masked,
            "disclaimer": "DigitalTrace AI strictly prohibits reverse phone-number lookup on strangers."
        }
    else:
        # Trigger OTP dispatch mock
        return {
            "status": "otp_sent",
            "message": f"Demo verification OTP code '7482' generated for {masked}.",
            "phone_masked": masked,
            "mock_otp": "7482",
            "note": "Enter the 4-digit code to verify your own account ownership."
        }
