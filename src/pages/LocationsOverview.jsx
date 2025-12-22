import React, { useEffect, useState } from "react";
import { fetchCountries } from "../api/admin_location";
import { MapPin, Info } from "lucide-react";

function LocationsOverview() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    const data = await fetchCountries();
    setCountries(data);
  };

  const getColorClass = (color) => {
    switch (color?.toLowerCase()) {
      case "blue":
        return "text-blue-600";
      case "red":
        return "text-red-600";
      case "yellow":
        return "text-yellow-500";
      default:
        return "text-gray-800";
    }
  };

  return (
    <div className="p-8 bg-emerald-50/20">
      {/* Info Banner */}
      <div className="flex items-start gap-4 rounded-xl bg-emerald-100/40 px-5 py-4 text-sm text-emerald-900 shadow-md mb-8">
        <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-emerald-200">
          <Info className="h-5 w-5 text-emerald-700" />
        </div>
        <p>
          Need immediate or emergency assistance? Our support centers are always
          here to help! Please choose from the contact numbers below for your
          product and region.
        </p>
      </div>

      {/* Country Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {countries.map((country) => (
          <div
            key={country.id}
            className="bg-white p-6 rounded-3xl shadow-md border border-emerald-100 hover:shadow-xl transition"
          >
            {/* Header with Icon */}
            <div
              className={`flex items-center mb-4 gap-3 ${getColorClass(
                country.icon_color
              )}`}
            >
              <MapPin className="w-6 h-6 text-emerald-600" />
              <h2 className="text-xl font-bold text-emerald-900">
                {country.country_name}
              </h2>
            </div>

            {/* Offices */}
            {country.offices?.map((office) => (
              <div
                key={office.id}
                className="mb-6 space-y-2 text-gray-800 text-sm"
              >
                <p className="font-medium text-emerald-800">
                  {office.office_name}
                </p>
                <p>
                  {office.address}
                  {office.city && `, ${office.city}`}
                  {office.province && `, ${office.province}`}
                </p>

                {/* Phones */}
                {office.phones && office.phones.length > 0 && (
                  <div>
                    <p className="font-medium text-emerald-700">Phone:</p>
                    <ul className="list-disc list-inside ml-4">
                      {office.phones.map((p, idx) => (
                        <li key={idx}>
                          {p.phone_number} {p.label && `(${p.label})`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Emails */}
                {office.emails && office.emails.length > 0 && (
                  <p>
                    <span className="font-medium text-emerald-700">Email:</span>{" "}
                    {office.emails.map((e, idx) => (
                      <span key={idx}>
                        <a
                          href={`mailto:${e.email_address}`}
                          className="text-emerald-600 underline"
                        >
                          {e.email_address}
                        </a>
                        {idx < office.emails.length - 1 && ", "}
                      </span>
                    ))}
                  </p>
                )}

                {/* Websites */}
                {office.websites && office.websites.length > 0 && (
                  <p>
                    <span className="font-medium text-emerald-700">
                      Website:
                    </span>{" "}
                    {office.websites.map((w, idx) => (
                      <span key={idx}>
                        <a
                          href={w.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 underline"
                        >
                          {w.website_url}
                        </a>
                        {idx < office.websites.length - 1 && ", "}
                      </span>
                    ))}
                  </p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LocationsOverview;
