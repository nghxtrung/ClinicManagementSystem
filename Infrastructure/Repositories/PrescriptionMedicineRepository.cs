using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Context;

namespace Infrastructure.Repositories
{
    public class PrescriptionMedicineRepository : BaseRepository<PrescriptionMedicine>, IPrescriptionMedicineRepository
    {
        public PrescriptionMedicineRepository(EFContext context) : base(context)
        {

        }
    }
}
