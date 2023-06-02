using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Context;

namespace Infrastructure.Repositories
{
    public class ServiceSubclinicDesignationRepository : BaseRepository<ServiceSubclinicDesignation>, IServiceSubclinicDesignationRepository
    {
        public ServiceSubclinicDesignationRepository(EFContext context) : base(context)
        {

        }
    }
}
