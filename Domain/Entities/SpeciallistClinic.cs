using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{
    [Table("tbl_SpeciallistClinic")]
    public sealed class SpeciallistClinic : BaseEntity
    {
        [Key]
        public string Code { get; set; }
        public string Name { get; set; }
    }
}
