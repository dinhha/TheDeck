using PetaPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Guline.Web.One.gModels
{
    public class Info
    {
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
    }
    [PetaPoco.TableName("MartinClub")]
    [PetaPoco.PrimaryKey("ID")]
    public class MartiniClub:Info
    {
        public long ID { get; set; }
    }
    [TableName("Contact")]
    [PrimaryKey("ID")]
    public class Contact:Info
    {
        public long ID { get; set; }
        public string Message { get; set; }
    }
    public class InfoBooking:Info
    {
        public int NumofPeople { get; set; }
    }
    [TableName("TableBooking")]
    [PrimaryKey("ID")]
    public class TableBooking:InfoBooking
    {
        public long ID { get; set; }
        public DateTime Date { get; set; }
        [ResultColumn]
        public string DateText
        {
            get
            {
                return Date.ToString();
            }
        }
        public string Time { get; set; }
        public bool HasBoat { get; set; }
        public int? NumberofBoat { get; set; }
        public string TypeBoat { get; set; }
        public string Note { get; set; }
        public long Price { get; set; }
    }
    [TableName("BoatBooking")]
    [PrimaryKey("ID")]
    public class BoatBooking : InfoBooking
    {
        public long ID { get; set; }
        public DateTime Date { get; set; }
        [ResultColumn]
        public string DateText
        {
            get
            {
                return Date.ToString();
            }
        }
        public string Time { get; set; }
        public string  TypeBoat{ get; set; }
        public int Hours { get; set; }
        public long Price { get; set; }
    }
    [TableName("EventBooking")]
    [PrimaryKey("ID")]
    public class EventBooking:InfoBooking
    {
        public long ID { get; set; }
        public string Company { get; set; }
        public string Address { get; set; }
        public string TelPhone { get; set; }
        public DateTime EventDate { get; set; }
        [ResultColumn]
        public string EventDateText
        {
            get
            {
                return EventDate.ToString();
            }
        }
        public string TypeEvent { get; set; }
        public string Note { get; set; }
    }
}