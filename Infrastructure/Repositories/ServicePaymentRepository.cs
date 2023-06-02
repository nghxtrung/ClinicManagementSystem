using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Context;

namespace Infrastructure.Repositories
{
    public class ServicePaymentRepository : BaseRepository<ServicePayment>, IServicePaymentRepository
    {
        public ServicePaymentRepository(EFContext context) : base(context)
        {

        }
    }
}
