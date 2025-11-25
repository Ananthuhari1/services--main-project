import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listServices } from '../assistance/userAssistance';

export default function Home() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await listServices();
      setServices(response.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  // Convert text → URL friendly slug
  const toSlug = (text) => {
    if (!text) return '';
    return String(text)
      .toLowerCase()
      .trim()
      .replace(/&/g, 'and')
      .replace(/[\s_]+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  };

  // Navigate to service or category page
  const handleServiceClick = (service) => {
    if (service && (service.category || service.primaryCategory)) {
      const category = service.category || service.primaryCategory;
      return navigate(`/services/category/${toSlug(category)}`);
    }
    if (service && service._id) {
      return navigate(`/services/${service._id}`);
    }
    navigate('/services');
  };

  const handleCategoryClick = (category) => {
    navigate(`/services/category/${toSlug(category)}`);
  };

  // Search navigation
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/services?search=${searchQuery}`);
    } else {
      navigate('/services');
    }
  };

  // Extract featured services
  const mostBookedServices = services.slice(0, 4);

  // Improved keyword-based category filter
  const getServicesByCategory = (keywords) => {
    console.log('All services:', services);
    const filtered = services
      .filter((service) => {
        const text =
          `${service.title || ''} ${service.description || ''} ${service.category || ''}`.toLowerCase();
        const matches = keywords.some((k) => text.includes(k.toLowerCase()));
        if (matches) {
          console.log('Matching service:', service);
          console.log('Matched text:', text);
          console.log('Matched keywords:', keywords.filter(k => text.includes(k.toLowerCase())));
        }
        return matches;
      })
      .slice(0, 4);
    console.log('Filtered services:', filtered);
    return filtered;
  };

  const salonServices = getServicesByCategory([
    'salon',
    'saloon',
    'waxing',
    'threading',
    'hair',
    'beauty',
    'cleanup',
    'facial',
    'manicure',
    'pedicure',
    'eyebrow',
    'spa',
    'makeup',
    'hairstyle',
    'haircut',
    'hair color',
    'highlights',
    'beauty treatment',
    'grooming'
  ]);

  const cleaningServices = services
    .filter((s) => String(s.category).toLowerCase() === 'cleaning')
    .slice(0, 4);

  const applianceServices = services
    .filter((s) => String(s.category).toLowerCase() === 'appliance')
    .slice(0, 4);

  const repairServices = getServicesByCategory([
    'repair',
    'installation',
    'drill',
    'switchboard',
    'fan',
    'cupboard',
  ]);

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/10 to-base-200">

      {/* Hero Section */}
      <section className="bg-base-100 py-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">

          {/* LEFT */}
          <div>
            <h1 className="text-4xl font-bold text-base-content mb-6">
              Home services at your doorstep
            </h1>

            {/* Search */}
{/* Search Bar */}
<div className="max-w-md mt-6">
  <p className="text-lg text-base-content/70 mb-3">
    What are you looking for?
  </p>

  <div className="relative w-full">
    <input
      type="text"
      placeholder="Search for services..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      className="input input-bordered input-lg w-full bg-linear-to-br from-primary/10 to-base-200 text-base-content pr-20"
    />

    {/* Search button FIXED to right — NO DISAPPEAR */}
    <button
      onClick={handleSearch}
      className="btn btn-primary btn-sm absolute top-1/2 right-2 -translate-y-1/2"
    >
      Search
    </button>
  </div>
</div>


            {/* Quick Category Buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              {[
                'Salon for women',
                'Bathroom & Kitchen Cleaning',
                'Electricians & Carpenters',
                'AC & Appliance Repair',
              ].map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className="btn btn-outline btn-sm md:btn-md"
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-12 mt-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">4.8</div>
                <div className="text-sm text-base-content/70">Service Rating*</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">12M+</div>
                <div className="text-sm text-base-content/70">Customers Globally*</div>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex w-full">
            <img
              src="MixCollage-13-Nov-2025-04-45-PM-6675.jpg"
              alt="Hero"
              className="rounded-lg w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* *************************** */}
      {/* BOOKED SERVICES */}
      {/* *************************** */}
      <section className="bg-base-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-base-content mb-8">
            Booked services
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Service Card 1 - Plumbing */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <figure className="px-4 pt-4">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&auto=format&fit=crop" 
                  alt="Plumbing Service" 
                  className="rounded-xl h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body p-4">
                <div className="flex items-center gap-1 mb-2">
                  <div className="rating rating-sm">
                    {[...Array(5)].map((_, i) => (
                      <input 
                        key={i}
                        type="radio" 
                        name="rating-1" 
                        className={`mask mask-star-2 ${i < 4 ? 'bg-orange-400' : 'bg-gray-300'}`}
                        disabled
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-1">4.79 (3.5M reviews)</span>
                </div>
                <h3 className="font-semibold text-lg">plumbing</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold">₹2000</span>
                  <button className="btn btn-primary btn-sm">Book Now</button>
                </div>
              </div>
            </div>

            {/* Service Card 2 - Plumbing Advanced */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <figure className="px-4 pt-4">
                <img 
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&auto=format&fit=crop" 
                  alt="Advanced Plumbing" 
                  className="rounded-xl h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body p-4">
                <div className="flex items-center gap-1 mb-2">
                  <div className="rating rating-sm">
                    {[...Array(5)].map((_, i) => (
                      <input 
                        key={i}
                        type="radio" 
                        name="rating-2" 
                        className="mask mask-star-2 bg-orange-400"
                        disabled
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-1">4.95 (2.1M reviews)</span>
                </div>
                <h3 className="font-semibold text-lg">plumbing-advanced</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold">₹2699</span>
                  <button className="btn btn-primary btn-sm">Book Now</button>
                </div>
              </div>
            </div>

            {/* Service Card 3 - Deep Cleaning */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <figure className="px-4 pt-4">
                <img 
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&auto=format&fit=crop" 
                  alt="Deep Home & Office Cleaning" 
                  className="rounded-xl h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body p-4">
                <div className="flex items-center gap-1 mb-2">
                  <div className="rating rating-sm">
                    {[...Array(5)].map((_, i) => (
                      <input 
                        key={i}
                        type="radio" 
                        name="rating-3" 
                        className={`mask mask-star-2 ${i < 4 ? 'bg-orange-400' : 'bg-gray-300'}`}
                        disabled
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-1">4.65 (1.2M reviews)</span>
                </div>
                <h3 className="font-semibold text-lg">Deep Home & Office Cleaning - Sparkling Fresh Every Time</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold">₹999</span>
                  <button className="btn btn-primary btn-sm">Book Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* *************************** */}
      {/* SALON FOR WOMEN */}
      {/* *************************** */}
      <section className="bg-base-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-base-content">Salon for Women</h2>
            <button className="btn btn-ghost btn-sm">See all</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service Card 1 - Threading */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <figure className="px-4 pt-4">
                <img 
                  src="https://5.imimg.com/data5/SELLER/Default/2023/11/357137821/ZA/SE/YL/196905178/women-eyebrows-threading-service-1000x1000.jpg" 
                  alt="Eyebrow Threading for Women" 
                  className="rounded-xl h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body p-4">
                <div className="flex items-center gap-1 mb-2">
                  <div className="rating rating-sm">
                    {[...Array(5)].map((_, i) => (
                      <input 
                        key={i}
                        type="radio" 
                        name="rating-4" 
                        className={`mask mask-star-2 ${i < 4 ? 'bg-orange-400' : 'bg-gray-300'}`}
                        disabled
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-1">4.7 (1.8M reviews)</span>
                </div>
                <h3 className="font-semibold text-lg">Eyebrow Threading</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold">₹299</span>
                  <button className="btn btn-primary btn-sm">Book Now</button>
                </div>
              </div>
            </div>

            {/* Service Card 2 - Hair Color */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <figure className="px-4 pt-4">
                <img 
                  src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=500&auto=format&fit=crop" 
                  alt="Hair Color & Highlights"
                  className="rounded-xl h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body p-4">
                <div className="flex items-center gap-1 mb-2">
                  <div className="rating rating-sm">
                    {[...Array(5)].map((_, i) => (
                      <input 
                        key={i}
                        type="radio" 
                        name="rating-5" 
                        className={`mask mask-star-2 ${i < 4 ? 'bg-orange-400' : 'bg-gray-300'}`}
                        disabled
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-1">4.5 (2.1M reviews)</span>
                </div>
                <h3 className="font-semibold text-lg">Hair Color & Highlights</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold">₹1,299</span>
                  <button className="btn btn-primary btn-sm">Book Now</button>
                </div>
              </div>
            </div>

            {/* Service Card 3 - Facial & Cleanup */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <figure className="px-4 pt-4">
                <img 
                  src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop" 
                  alt="Facial & Cleanup" 
                  className="rounded-xl h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body p-4">
                <div className="flex items-center gap-1 mb-2">
                  <div className="rating rating-sm">
                    {[...Array(5)].map((_, i) => (
                      <input 
                        key={i}
                        type="radio" 
                        name="rating-6" 
                        className={`mask mask-star-2 ${i < 5 ? 'bg-orange-400' : 'bg-gray-300'}`}
                        disabled
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-1">4.9 (3.1M reviews)</span>
                </div>
                <h3 className="font-semibold text-lg">Facial & Cleanup</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold">₹1299</span>
                  <button className="btn btn-primary btn-sm">Book Now</button>
                </div>
              </div>
            </div>

            {/* Service Card 4 - Threading & Waxing */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <figure className="px-4 pt-4">
                <img 
                  src="https://images.unsplash.com/photo-1522337360788-8b13de241667?w=500&auto=format&fit=crop" 
                  alt="Threading & Waxing" 
                  className="rounded-xl h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body p-4">
                <div className="flex items-center gap-1 mb-2">
                  <div className="rating rating-sm">
                    {[...Array(5)].map((_, i) => (
                      <input 
                        key={i}
                        type="radio" 
                        name="rating-7" 
                        className={`mask mask-star-2 ${i < 4 ? 'bg-orange-400' : 'bg-gray-300'}`}
                        disabled
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-1">4.7 (2.3M reviews)</span>
                </div>
                <h3 className="font-semibold text-lg">Threading & Waxing</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold">₹499</span>
                  <button className="btn btn-primary btn-sm">Book Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Salon */}
      {salonServices.length > 0 && (
        <Section
          title="Salon for men & women"
          list={salonServices}
          handleServiceClick={handleServiceClick}
        />
      )}

      {/* Cleaning */}
      {cleaningServices.length > 0 && (
        <Section
          title="Cleaning & pest control"
          list={cleaningServices}
          handleServiceClick={handleServiceClick}
        />
      )}

      {/* Appliances */}
      {applianceServices.length > 0 && (
        <Section
          title="Appliance repair & service"
          list={applianceServices}
          handleServiceClick={handleServiceClick}
          seeAll="/services/category/appliance"
        />
      )}

      {/* Electricians & Carpenters */}
      <section className="bg-base-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-base-content">Electricians & Carpenters</h2>
            <button className="btn btn-ghost btn-sm">See all</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service Card 1 - Electrician */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <figure className="px-4 pt-4">
                <img 
                  src="https://images.unsplash.com/photo-1605152276897-4f618f831968?w=500&auto=format&fit=crop" 
                  alt="Electrician Services" 
                  className="rounded-xl h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body p-4">
                <div className="flex items-center gap-1 mb-2">
                  <div className="rating rating-sm">
                    {[...Array(5)].map((_, i) => (
                      <input 
                        key={i}
                        type="radio" 
                        name="rating-8" 
                        className={`mask mask-star-2 ${i < 4 ? 'bg-orange-400' : 'bg-gray-300'}`}
                        disabled
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-1">4.8 (2.1M reviews)</span>
                </div>
                <h3 className="font-semibold text-lg">Electrical Repairs</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold">₹599</span>
                  <button className="btn btn-primary btn-sm">Book Now</button>
                </div>
              </div>
            </div>

            {/* Service Card 2 - Carpenter */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <figure className="px-4 pt-4">
                <img 
                  src="https://images.unsplash.com/photo-1600607686527-6fb886090705?w=500&auto=format&fit=crop" 
                  alt="Carpentry Services" 
                  className="rounded-xl h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body p-4">
                <div className="flex items-center gap-1 mb-2">
                  <div className="rating rating-sm">
                    {[...Array(5)].map((_, i) => (
                      <input 
                        key={i}
                        type="radio" 
                        name="rating-9" 
                        className={`mask mask-star-2 ${i < 4 ? 'bg-orange-400' : 'bg-gray-300'}`}
                        disabled
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-1">4.7 (1.8M reviews)</span>
                </div>
                <h3 className="font-semibold text-lg">Carpentry Work</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold">₹899</span>
                  <button className="btn btn-primary btn-sm">Book Now</button>
                </div>
              </div>
            </div>

            {/* Service Card 3 - Switchboard Repair */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <figure className="px-4 pt-4">
                <img 
                  src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop" 
                  alt="Switchboard Repair" 
                  className="rounded-xl h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body p-4">
                <div className="flex items-center gap-1 mb-2">
                  <div className="rating rating-sm">
                    {[...Array(5)].map((_, i) => (
                      <input 
                        key={i}
                        type="radio" 
                        name="rating-10" 
                        className={`mask mask-star-2 ${i < 5 ? 'bg-orange-400' : 'bg-gray-300'}`}
                        disabled
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-1">4.9 (1.2M reviews)</span>
                </div>
                <h3 className="font-semibold text-lg">Switchboard Repair</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold">₹799</span>
                  <button className="btn btn-primary btn-sm">Book Now</button>
                </div>
              </div>
            </div>

            {/* Service Card 4 - Furniture Assembly */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <figure className="px-4 pt-4">
                <img 
                  src="https://images.unsplash.com/photo-1600585154526-990dced4b60b?w=500&auto=format&fit=crop" 
                  alt="Furniture Assembly" 
                  className="rounded-xl h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body p-4">
                <div className="flex items-center gap-1 mb-2">
                  <div className="rating rating-sm">
                    {[...Array(5)].map((_, i) => (
                      <input 
                        key={i}
                        type="radio" 
                        name="rating-11" 
                        className={`mask mask-star-2 ${i < 4 ? 'bg-orange-400' : 'bg-gray-300'}`}
                        disabled
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-1">4.6 (1.5M reviews)</span>
                </div>
                <h3 className="font-semibold text-lg">Furniture Assembly</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold">₹699</span>
                  <button className="btn btn-primary btn-sm">Book Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AC & Appliance Repair */}
      <section className="bg-base-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-base-content">AC & Appliance Repair</h2>
            <button className="btn btn-ghost btn-sm">See all</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service Card 1 - AC Repair */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <figure className="px-4 pt-4">
                <img 
                  src="https://images.unsplash.com/photo-1558002038-1055907df827?w=500&auto=format&fit=crop" 
                  alt="AC Repair & Service" 
                  className="rounded-xl h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body p-4">
                <div className="flex items-center gap-1 mb-2">
                  <div className="rating rating-sm">
                    {[...Array(5)].map((_, i) => (
                      <input 
                        key={i}
                        type="radio" 
                        name="rating-12" 
                        className={`mask mask-star-2 ${i < 4 ? 'bg-orange-400' : 'bg-gray-300'}`}
                        disabled
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-1">4.7 (1.9M reviews)</span>
                </div>
                <h3 className="font-semibold text-lg">AC Repair & Service</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold">₹1299</span>
                  <button className="btn btn-primary btn-sm">Book Now</button>
                </div>
              </div>
            </div>

            {/* Service Card 2 - Refrigerator Repair */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <figure className="px-4 pt-4">
                <img 
                  src="https://images.unsplash.com/photo-1571175443880-49e1d933640c?w=500&auto=format&fit=crop" 
                  alt="Refrigerator Repair" 
                  className="rounded-xl h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body p-4">
                <div className="flex items-center gap-1 mb-2">
                  <div className="rating rating-sm">
                    {[...Array(5)].map((_, i) => (
                      <input 
                        key={i}
                        type="radio" 
                        name="rating-13" 
                        className={`mask mask-star-2 ${i < 4 ? 'bg-orange-400' : 'bg-gray-300'}`}
                        disabled
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-1">4.6 (1.5M reviews)</span>
                </div>
                <h3 className="font-semibold text-lg">Refrigerator Repair</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold">₹1499</span>
                  <button className="btn btn-primary btn-sm">Book Now</button>
                </div>
              </div>
            </div>

            {/* Service Card 3 - Washing Machine Repair */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <figure className="px-4 pt-4">
                <img 
                  src="https://images.unsplash.com/photo-1556906781-2a5e483511bb?w=500&auto=format&fit=crop" 
                  alt="Washing Machine Repair" 
                  className="rounded-xl h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body p-4">
                <div className="flex items-center gap-1 mb-2">
                  <div className="rating rating-sm">
                    {[...Array(5)].map((_, i) => (
                      <input 
                        key={i}
                        type="radio" 
                        name="rating-14" 
                        className={`mask mask-star-2 ${i < 5 ? 'bg-orange-400' : 'bg-gray-300'}`}
                        disabled
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-1">4.8 (1.7M reviews)</span>
                </div>
                <h3 className="font-semibold text-lg">Washing Machine Repair</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold">₹999</span>
                  <button className="btn btn-primary btn-sm">Book Now</button>
                </div>
              </div>
            </div>

            {/* Service Card 4 - Microwave & Oven Repair */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <figure className="px-4 pt-4">
                <img 
                  src="https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=500&auto=format&fit=crop" 
                  alt="Microwave & Oven Repair" 
                  className="rounded-xl h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body p-4">
                <div className="flex items-center gap-1 mb-2">
                  <div className="rating rating-sm">
                    {[...Array(5)].map((_, i) => (
                      <input 
                        key={i}
                        type="radio" 
                        name="rating-15" 
                        className={`mask mask-star-2 ${i < 4 ? 'bg-orange-400' : 'bg-gray-300'}`}
                        disabled
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-1">4.5 (1.2M reviews)</span>
                </div>
                <h3 className="font-semibold text-lg">Microwave & Oven Repair</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold">₹899</span>
                  <button className="btn btn-primary btn-sm">Book Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Home Repair */}
      {repairServices.length > 0 && (
        <Section
          title="Home repair & installation"
          list={repairServices}
          handleServiceClick={handleServiceClick}
          seeAll="/services/category/electrical"
        />
      )}
    </div>
  );
}

/* --------------------------
  REUSABLE SECTION COMPONENT
----------------------------*/
function Section({ title, list, handleServiceClick, seeAll }) {
  const navigate = useNavigate();

  return (
    <section className="py-12 px-4 bg-base-100">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-base-content">{title}</h2>

          {seeAll && (
            <button
              onClick={() => navigate(seeAll)}
              className="btn btn-ghost btn-sm"
            >
              See all
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {list.map((service) => (
            <div
              key={service._id}
              onClick={() => handleServiceClick(service)}
              className="bg-linear-to-br from-primary/10 to-base-200 border border-base-300 rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <img
                src={service.image || '/placeholder.png'}
                onError={(e) => (e.target.src = '/placeholder.png')}
                alt={service.title}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h3 className="font-semibold text-base-content mb-2 line-clamp-2">
                {service.title}
              </h3>
              <span className="text-lg font-bold text-primary">
                ₹{service.price}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}