import smtplib
from email.message import EmailMessage

from config import SMTP_FROM, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USER


def send_otp_email(email: str, code: str) -> None:
    if not SMTP_HOST:
        # No SMTP configured (local dev, tests) — print the code instead of failing.
        # print() is used over logging since uvicorn's default config filters out INFO by default.
        print(f"[dev] OTP for {email}: {code}")
        return

    message = EmailMessage()
    message["Subject"] = "Your Pane Analytics login code"
    message["From"] = SMTP_FROM
    message["To"] = email
    message.set_content(f"Your Pane Analytics login code is {code}. It expires in 10 minutes.")

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
        smtp.starttls()
        if SMTP_USER and SMTP_PASSWORD:
            smtp.login(SMTP_USER, SMTP_PASSWORD)
        smtp.send_message(message)
