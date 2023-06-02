using Domain.Entities;

namespace Domain.Interfaces
{
    public interface IAuthencationRepository
    {
        string CreateToken(User user, string secretKey);
        void CreatePassword(string password, out byte[] passwordHash, out byte[] passwordSalt);
        bool VerifyPassword(string password, byte[] passwordHash, byte[] passwordSalt);
    }
}
