using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Guline.Web.One.gModels
{
    public class Cart
    {
        public Cart()
        {
            List = new List<CartItem>();
            TotalAmount = 0;
            Count = 0;
        }
        public List<CartItem> List { get; set; }

        public int Count { get; set; }

        public long TotalAmount { get; set; }

        public CartItem find(long ID)
        {
            return List.Where(m => m.ID == ID).FirstOrDefault();
        }
        public void AddUpdateCart(CartItem obj)
        {
            var found = List.Where(m => m.ID == obj.ID).FirstOrDefault();
            if (found == null)
            {
                List.Add(obj);
                Count = Count + 1;
                if(obj.Object.Attrs[1].AttrValue!=null)
                {
                
                TotalAmount = TotalAmount + int.Parse(obj.Object.Attrs[1].AttrValue);
                }
                else
                {
                    TotalAmount = TotalAmount + int.Parse(obj.Object.Attrs[0].AttrValue);
                }
            }
            else
            {
                if (obj.Quantity == 0)
                {
                    List.Remove(found);
                }
                else
                    found.Quantity = obj.Quantity;

            }
        }
    }
    public class CartItem
    {
        public long ID { get; set; }
        public int Quantity { get; set; }

        public gModels.gObject Object { get; set; }
    }
}