from enum import Enum

class UserRole(str, Enum):
    CITIZEN = "citizen"
    POLICE_OFFICER = "police_officer"
    ADMIN = "admin"