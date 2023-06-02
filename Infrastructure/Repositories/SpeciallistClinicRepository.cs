using Dapper;
using Domain.Entities;
using Domain.Interfaces;
using Domain.View;
using Infrastructure.Context;
using System.Data;

namespace Infrastructure.Repositories
{
    public class SpeciallistClinicRepository : BaseRepository<SpeciallistClinic>, ISpeciallistClinicRepository
    {
        private readonly IDbConnection _connection;

        public SpeciallistClinicRepository(EFContext efContext, DapperContext dapperContext) : base(efContext)
        {
            _connection = dapperContext.CreateConnection();
        }

        public async Task<IEnumerable<SpeciallistClinicStatus>> GetListSpeciallistClinicStatus()
        {
            return await _connection.QueryAsync<SpeciallistClinicStatus>("");
        }
    }
}
