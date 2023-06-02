using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{
    [Table("tbl_IcdDiagnose")]
    public sealed class IcdDiagnose : BaseEntity
    {
        [Key]
        public string Code { get; set; }
        public string Name { get; set; }
    }
}
