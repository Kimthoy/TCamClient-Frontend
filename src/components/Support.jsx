import React, { useState } from "react";
import {
  Headset,
  MessageCircle,
  Facebook,
  Phone,
  Youtube,
  X,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
const whatsappNumber = "855769881111";
const message = encodeURIComponent("Hello, I need help with your service");
const contacts = [
  {
    name: "Telegram",
    href: "https://t.me/mechsamren",
    icon: MessageCircle,
    color: "sky",
    desc: "Chat with us directly on Telegram",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61587241251785",
    icon: Facebook,
    color: "blue",
    desc: "Visit our Facebook page for support",
  },
  {
    name: "Phone Call",
    href: "tel:+855769881111",
    icon: Phone,
    color: "green",
    desc: "Call us for immediate assistance",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@yourchannel",
    icon: Youtube,
    color: "red",
    desc: "Watch our tutorial videos on YouTube",
  },

  {
    name: "WhatsApp",
    href: `https://wa.me/${whatsappNumber}?text=${message}`,
    icon: FaWhatsapp,
    color: "green",
    desc: "Chat with us on WhatsApp",
  },
];

const Support = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Support Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen(true)}
          className="
        w-14 h-14 bg-blue-600 rounded-full shadow-xl
        flex items-center justify-center
        hover:scale-110 active:scale-95
        transition
      "
        >
          <Headset className="w-7 h-7 text-white" />
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Modal Box */}
          <div
            className="
          relative bg-white w-full md:max-w-4xl
          max-h-[90vh] overflow-hidden
          rounded-t-3xl md:rounded-3xl
          shadow-2xl
          animate-slideUp
        "
          >
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="
            absolute top-4 right-4 z-10
            p-2 rounded-xl
            text-red-500 hover:bg-red-100
            transition
          "
            >
              <X className="w-6 h-6" />
            </button>

            {/* Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* LEFT SIDE (Hidden on small screens) */}
              <div className="hidden md:flex p-8 flex-col gap-4 bg-blue-50">
                <h2 className="text-2xl font-bold text-blue-700">
                  Need Help? We’re Here for You
                </h2>

                <p className="text-gray-600 leading-relaxed">
                  Our support team is ready to assist you with system usage,
                  services, or technical issues.
                </p>

                <img
                  src="https://illustrations.popsy.co/blue/customer-support.svg"
                  alt="Support"
                  className="w-full max-w-sm mt-6"
                />
              </div>

              {/* RIGHT SIDE */}
              <div className="p-6 md:p-8">
                <h3 className="text-lg font-semibold mb-4">Contact Support</h3>

                <div className="space-y-3">
                  {contacts.map((contact) => {
                    const Icon = contact.icon;

                    return (
                      <a
                        key={contact.name}
                        href={contact.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                      group flex items-center gap-4 p-4
                      rounded-xl border
                      transition-all duration-300
                      ${contact.bg}
                      hover:shadow-md
                    `}
                      >
                        <Icon
                          className={`
                        w-7 h-7 ${contact.text}
                        group-hover:scale-110 transition
                      `}
                        />

                        <div>
                          <div className="font-medium">{contact.name}</div>
                          <div className="text-sm text-gray-500">
                            {contact.desc}
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Support;
