import { Link } from 'react-router-dom';
import { MessageCircle, Phone, Mail } from 'lucide-react';
import './FAQ.css';

export function FAQ() {
  const faqs = [
    {
      q: "How do I place an order?",
      a: "Call or WhatsApp us at 0726 380 266, or visit our shop at Kamukunji Gateway Mall 2nd Floor Shop 24."
    },
    {
      q: "Do you deliver outside Nairobi?",
      a: "Yes! We offer next-day delivery to all major towns in Kenya."
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept M-Pesa, bank transfers, and cash on delivery."
    },
    {
      q: "Can I return a product?",
      a: "Yes, within 7 days if unused and in original packaging."
    }
  ];

  return (
    <div className="page-container">
      <Link to="/" className="back-link">← Back to Home</Link>
      
      <h1>FAQ & Help</h1>
      
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <h3>{faq.q}</h3>
            <p>{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="contact-help">
        <h3>Still Need Help?</h3>
        <p>Contact us directly:</p>
        <div className="contact-options">
          <a href="tel:+254726380266" className="contact-btn">
            <Phone size={20} /> Call 0726 380 266
          </a>
          <a href="https://wa.me/254726380266" className="contact-btn">
            <MessageCircle size={20} /> WhatsApp Us
          </a>
          <a href="mailto:advencokitchenwish@gmail.com" className="contact-btn">
            <Mail size={20} /> Email Us
          </a>
        </div>
      </div>
    </div>
  );
}