using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Context;

namespace Infrastructure.Repositories
{
    public class ServiceSubclinicalRepository : BaseRepository<ServiceSubclinical>, IServiceSubclinicalRepository
    {
        public ServiceSubclinicalRepository(EFContext context) : base(context)
        {

        }
    }
}
