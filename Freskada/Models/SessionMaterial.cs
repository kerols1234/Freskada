using System.ComponentModel.DataAnnotations.Schema;

namespace Freskada.Models
{
    public class SessionMaterial
    {
        public int NumberOfPieces { get; set; } = 1;
        public double Price { get; set; }
        public int SessionId { get; set; }
        [ForeignKey("SessionId")]
        public virtual Session Session { get; set; }
        public int MaterialId { get; set; }
        [ForeignKey("MaterialId")]
        public virtual Material Material { get; set; }
    }
}
