using Domain.View;

namespace Domain.Interfaces
{
    public interface IStatisticRepository
    {
        Task<IEnumerable<ServiceTypeTotalPrice>> GetServiceTypeTotalPriceStatistics();
        Task<IEnumerable<SpeciallistClinicStatus>> GetSpeciallistClinicStatusStatistics();
        Task<IEnumerable<DiagnoseTotalCount>> GetDiagnoseTotalCountStatistics();
    }
}
