using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Context;

namespace Infrastructure.Repositories
{
    public class PatientExaminationRepository : BaseRepository<PatientExamination>, IPatientExaminationRepository
    {
        public PatientExaminationRepository(EFContext context) : base(context)
        {

        }
    }
}
