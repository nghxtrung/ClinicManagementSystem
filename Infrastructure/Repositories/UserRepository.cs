using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Context;
using Infrastructure.Repositories;

namespace Application.Users
{
    public class UserRepository : BaseRepository<Domain.Entities.User>, IUserRepository
    {
        public UserRepository(EFContext context) : base(context)
        {

        }
    }
}
