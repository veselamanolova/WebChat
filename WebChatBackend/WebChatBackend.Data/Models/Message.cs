using System;
using System.ComponentModel.DataAnnotations;

namespace WebChatBackend.Data.Models
{
    public class Message
    {
        public int Id { get; set; }
        public int GroupId { get; set; }
        public int UserId { get; set; }
        [Required, MinLength(1)]
        public string Text { get; set; }
        public DateTime Date { get; set; }        
    }
}
