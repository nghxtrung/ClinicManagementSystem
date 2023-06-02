using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Context;

namespace Infrastructure.Repositories
{
    public class DiagnoseRepository : BaseRepository<Diagnose>, IDiagnoseRepository
    {
        public DiagnoseRepository(EFContext context) : base(context)
        {

        }
    }
}
