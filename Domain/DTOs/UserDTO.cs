using Domain.Enums;

namespace Domain.DTOs
{
    public class UserDTO
    {
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public UserRole Role { get; set; }
    }
}
