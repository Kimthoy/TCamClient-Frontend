import React, { useState } from "react";
import {
  Headset,
  MessageCircle,
  Facebook,
  Phone,
  Youtube,
  X,
} from "lucide-react";

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
    href: "https://facebook.com/yourpage",
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
];

const Support = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed  bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen(true)}
          className="w-12 h-12 bg-blue-600 rounded-full shadow-lg
                     flex items-center justify-center
                     hover:scale-110 cursor-pointer transition"
        >
          <Headset className="w-7 h-7  text-white" />
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Modal Content */}
          <div
            className="
    relative bg-white w-full max-w-4xl mx-4  shadow-xl
    max-h-[95vh] overflow-hidden
  "
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 z-10"
            >
              <X className="w-8 h-8 cursor-pointer text-red-500 hover:bg-red-100 p-2 rounded-xl transition" />
            </button>

            {/* Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* LEFT SIDE */}
              <div className="p-8 flex flex-col justify-center gap-4 bg-blue-50">
                <h2 className="text-2xl font-bold text-blue-700">
                  Need Help? We’re Here for You
                </h2>

                <p className="text-gray-600 leading-relaxed">
                  Our support team is ready to assist you with any questions
                  related to our services, system usage, or technical issues.
                  Choose your preferred contact method and get help instantly.
                </p>

                <p className="text-gray-600">
                  We respond fast and make sure you get the best experience.
                </p>

                <img
                  src="https://illustrations.popsy.co/blue/customer-support.svg"
                  alt="Support"
                  className="w-full max-w-sm mt-4"
                />
              </div>

              {/* RIGHT SIDE */}
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Contact Support</h3>

                <div className="space-y-4">
                  {contacts.map((contact) => {
                    const Icon = contact.icon;
                    return (
                      <a
                        key={contact.name}
                        href={contact.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                          group flex items-center gap-3 p-4 rounded-xl
                          transition-all duration-300
                          hover:bg-${contact.color}-50 hover:shadow-md
                        `}
                      >
                        <Icon
                          className={`
                            w-6 h-6 text-${contact.color}-600
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
