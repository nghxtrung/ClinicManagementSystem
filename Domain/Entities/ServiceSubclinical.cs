using Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{
    [Table("tbl_ServiceSubclinical")]
    public class ServiceSubclinical : BaseEntity
    {
        [Key]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public ServiceType Type { get; set; }
        public string SpeciallistClinicCode { get; set; }
    }
}
