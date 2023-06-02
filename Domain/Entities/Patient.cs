using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{
    [Table("tbl_Patient")]
    public sealed class Patient : BaseEntity
    {
        [Key]
        public string Code { get; set; }
        public string Name { get; set; }
        public DateTime DateOfBirth { get; set; }
        public bool Sex { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
    }
}
