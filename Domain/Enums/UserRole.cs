using System.ComponentModel;

namespace Domain.Enums
{
    public enum UserRole
    {
        [Description("Quản trị")]
        Admin,
        [Description("Bác sĩ")]
        Doctor,
        [Description("Lễ tân")]
        Receptionist
    }
}
