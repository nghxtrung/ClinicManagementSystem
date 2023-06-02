using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Context;

namespace Infrastructure.Repositories
{
    public class PatientExaminationDiagnoseRepository : BaseRepository<PatientExaminationDiagnose>, IPatientExaminationDiagnoseRepository
    {
        public PatientExaminationDiagnoseRepository(EFContext context) : base(context)
        {

        }
    }
}
