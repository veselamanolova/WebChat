using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace WebChatBackend.Data.Models
{
    public class Message
    {
        public int Id { get; set; }
        public int? GroupId { get; set; }
        public string UserId { get; set; }       
        [Required, MinLength(1)]
        public string Text { get; set; }
        public DateTime Date { get; set; }        
        public Group Group { get; set; }
        public User User { get; set; }       
    }
}
