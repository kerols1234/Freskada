using Freskada.Models.ViewModels;
using System.Collections.Generic;
using System.Security.Claims;

namespace Freskada.Data
{
    public static class ClaimStore
    {
        public static List<ClaimGroup> ClaimsList = new List<ClaimGroup>()
        {
            new ClaimGroup()
            {
                GroupName = "User",
                Claims = new List<Claim>()
                {
                    new Claim("CreateUser","Create User"),
                    new Claim("EditUser","Edit User"),
                    new Claim("DeleteUser","Delete User"),
                    new Claim("ViewUser","View User"),
                }
            },
            new ClaimGroup()
            {
                GroupName = "Booking",
                Claims = new List<Claim>()
                {
                    new Claim("CreateBooking","Create Booking"),
                    new Claim("EditBooking","Edit Booking"),
                    new Claim("DeleteBooking","Delete Booking"),
                    new Claim("ViewBooking","View Booking"),
                }
            },
            new ClaimGroup()
            {
                GroupName = "Doctor",
                Claims = new List<Claim>()
                {
                    new Claim("CreateDoctor","Create Doctor"),
                    new Claim("EditDoctor","Edit Doctor"),
                    new Claim("DeleteDoctor","Delete Doctor"),
                    new Claim("ViewDoctor","View Doctor"),
                }
            },
            new ClaimGroup()
            {
                GroupName = "Expense",
                Claims = new List<Claim>()
                {
                    new Claim("CreateExpense","Create Expense"),
                    new Claim("EditExpense","Edit Expense"),
                    new Claim("DeleteExpense","Delete Expense"),
                    new Claim("ViewExpense","View Expense"),
                }
            },
            new ClaimGroup()
            {
                GroupName = "Material",
                Claims = new List<Claim>()
                {
                    new Claim("CreateMaterial","Create Material"),
                    new Claim("EditMaterial","Edit Material"),
                    new Claim("DeleteMaterial","Delete Material"),
                    new Claim("ViewMaterial","View Material"),
                }
            },
            new ClaimGroup()
            {
                GroupName = "Patient",
                Claims = new List<Claim>()
                {
                    new Claim("CreatePatient","Create Patient"),
                    new Claim("EditPatient","Edit Patient"),
                    new Claim("DeletePatient","Delete Patient"),
                    new Claim("ViewPatient","View Patient"),
                }
            },
            new ClaimGroup()
            {
                GroupName = "Purchase",
                Claims = new List<Claim>()
                {
                    new Claim("CreatePurchase","Create Purchase"),
                    new Claim("EditPurchase","Edit Purchase"),
                    new Claim("DeletePurchase","Delete Purchase"),
                    new Claim("ViewPurchase","View Purchase"),
                }
            },
            new ClaimGroup()
            {
                GroupName = "Session",
                Claims = new List<Claim>()
                {
                    new Claim("CreateSession","Create Session"),
                    new Claim("EditSession","Edit Session"),
                    new Claim("DeleteSession","Delete Session"),
                    new Claim("ViewSession","View Session"),
                }
            },
        };
    }
}
