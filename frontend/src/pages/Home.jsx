import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, MapPin, Clock, Star, Calendar as CalendarIcon, Menu, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { supabase } from '../supabaseClient';
import {
  clinicData,
  doctorData,
  servicesData,
  whyChooseUsData,
  reviewsData,
  galleryData,
  faqData
} from '../mock';

const Home = () => {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    patient_name: '',
    phone: '',
    appointment_time: '',
    message: ''
  });

  const timeSlots = [
    '9:00 AM',
    '9:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM',
    '12:30 PM',
    '6:00 PM',
    '6:30 PM',
    '7:00 PM',
    '7:30 PM',
    '8:00 PM',
    '8:30 PM',
    '9:00 PM',
    '9:30 PM',
    '10:00 PM',
    '10:30 PM',
    '11:00 PM'
  ];

  const handleAppointmentInputChange = (e) => {
    setAppointmentData({
      ...appointmentData,
      [e.target.name]: e.target.value
    });
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format date for Supabase (YYYY-MM-DD)
      const formattedDate = format(appointmentDate, 'yyyy-MM-dd');

      // Prepare data for insertion
      const insertData = {
        patient_name: appointmentData.patient_name,
        phone: appointmentData.phone,
        appointment_date: formattedDate,
        appointment_time: appointmentData.appointment_time,
        message: appointmentData.message || null
      };

      console.log('Submitting appointment:', insertData);

      // Insert into Supabase
      const { data, error } = await supabase
        .from('appointments')
        .insert([insertData]);

      if (error) {
        console.error(error);
        alert(error.message);
        setIsSubmitting(false);
        return;
      }

      // Success
      alert('Appointment request submitted successfully!');
      
      // Reset form
      setAppointmentData({
        patient_name: '',
        phone: '',
        appointment_time: '',
        message: ''
      });
      setAppointmentDate(undefined);
      
      // Close modal
      setIsAppointmentModalOpen(false);
      
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCallNow = () => {
    window.location.href = `tel:${clinicData.contact.phone.replace(/\s/g, '')}`;
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${clinicData.contact.whatsapp}`, '_blank');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'About', id: 'about' },
    { label: 'Services', id: 'services' },
    { label: 'Why Us', id: 'why-us' },
    { label: 'Reviews', id: 'reviews' },
    { label: 'Gallery', id: 'gallery' },
    { label: 'FAQ', id: 'faq' },
    { label: 'Contact', id: 'contact' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo / Clinic Name */}
            <div className="flex-shrink-0">
              <h2 className="text-lg font-bold text-[#1E3A5F]">{clinicData.name}</h2>
              <p className="text-xs text-gray-500">{clinicData.location.area}, {clinicData.location.city}</p>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-gray-700 hover:text-[#1E3A5F] font-medium text-sm transition-colors whitespace-nowrap"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Desktop CTA Button */}
            <div className="hidden lg:block">
              <Button onClick={() => setIsAppointmentModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Book Appointment
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className="text-gray-700 hover:text-[#1E3A5F] font-medium text-sm py-2 text-left"
                  >
                    {link.label}
                  </button>
                ))}
                <div className="pt-3 flex flex-col gap-2">
                  <Button onClick={() => { setIsAppointmentModalOpen(true); setIsMobileMenuOpen(false); }} size="sm" className="bg-red-600 hover:bg-red-700 text-white font-semibold w-full">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    Book Appointment
                  </Button>
                  <div className="flex gap-2">
                    <Button onClick={handleCallNow} size="sm" variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-50 flex-1">
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                    <Button onClick={handleWhatsApp} size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 flex-1">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section - Compact Layout */}
      <section className="bg-gradient-to-br from-[#F8FAFC] to-[#E8F4F8] py-8 lg:py-12 min-h-[calc(100vh-64px)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Left Column - Content */}
            <div className="flex-1 order-2 lg:order-1">
              {/* Specialty Badge */}
              <div className="inline-flex items-center bg-red-50 text-red-600 px-3 py-1.5 rounded-full mb-4 border border-red-200">
                <MapPin className="w-3 h-3 mr-1.5" />
                <span className="text-xs font-medium">DENTAL CLINIC IN NALASOPARA</span>
              </div>

              {/* Clinic Name */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1E3A5F] mb-1">
                Dr Shukla <span className="text-red-600">Dental Clinic</span>
              </h1>

              {/* Tagline */}
              <p className="text-base text-gray-600 italic mb-4">
                "Restoring Smiles... Building Confidence"
              </p>

              {/* Doctor Info */}
              <div className="mb-4">
                <p className="text-lg font-semibold text-[#1E3A5F]">{doctorData.name}</p>
                <p className="text-sm text-gray-600">{doctorData.qualifications} • {doctorData.registration}</p>
              </div>

              {/* Address */}
              <div className="flex items-start text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 text-red-500 flex-shrink-0" />
                <p className="text-xs leading-relaxed">{clinicData.location.fullAddress}</p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setIsAppointmentModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 h-9 text-sm">
                  <CalendarIcon className="w-4 h-4 mr-1.5" />
                  Book Appointment
                </Button>
                <Button onClick={handleCallNow} variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 font-semibold px-4 h-9 text-sm">
                  <Phone className="w-4 h-4 mr-1.5" />
                  Call Now
                </Button>
                <Button onClick={handleWhatsApp} variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 font-semibold px-4 h-9 text-sm">
                  <MessageCircle className="w-4 h-4 mr-1.5" />
                  WhatsApp
                </Button>
              </div>
            </div>

            {/* Right Column - Doctor Image (Square, Smaller) */}
            <div className="order-1 lg:order-2 flex-shrink-0">
              <div className="relative">
                <img 
                  src={doctorData.image} 
                  alt="Dr. Yogendra R. Shukla - Best Dentist in Nalasopara"
                  className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-2xl object-cover object-top shadow-xl border-4 border-white"
                />
                {/* Google Rating Badge */}
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg px-3 py-2 border border-gray-200">
                  <div className="flex items-center gap-0.5 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-gray-800 text-center whitespace-nowrap">{clinicData.googleRating.stars} · {clinicData.googleRating.reviews}+ Reviews</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-8 pt-6 border-t border-gray-300">
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-red-600">18+</p>
              <p className="text-xs text-gray-600">Years Exp.</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-red-600 flex items-center justify-center">
                {clinicData.googleRating.stars}<Star className="w-4 h-4 fill-yellow-400 text-yellow-400 ml-0.5" />
              </p>
              <p className="text-xs text-gray-600">Rating</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-red-600">{clinicData.googleRating.reviews}+</p>
              <p className="text-xs text-gray-600">Reviews</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-red-600">365</p>
              <p className="text-xs text-gray-600">Days Open</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Doctor Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src={doctorData.image} 
                alt="Dr. Yogendra R. Shukla - Best Dentist in Nalasopara, Palghar"
                className="rounded-2xl w-full h-auto object-cover shadow-lg"
                loading="lazy"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#1E3A5F] mb-4">About {doctorData.name}</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {doctorData.about}
              </p>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-[#1E3A5F] mb-3">Advanced Training & Certifications:</h3>
                  <ul className="space-y-2">
                    {doctorData.advancedTraining.map((item, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="text-[#0EA5A4] mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#1E3A5F] mb-3">Specialized In:</h3>
                  <ul className="space-y-2">
                    {doctorData.expertise.map((item, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="text-[#0EA5A4] mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-[#F8FAFC] to-[#E0F2F1] p-6 rounded-xl border border-[#0EA5A4]/20">
                  <h3 className="text-xl font-semibold text-[#1E3A5F] mb-3">Known For:</h3>
                  <ul className="space-y-2">
                    {doctorData.knownFor.map((item, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="text-[#16A34A] mr-2 font-bold">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1E3A5F] mb-4">Our Services</h2>
            <p className="text-[#64748B] max-w-2xl mx-auto">
              Comprehensive dental care services delivered with professional expertise and modern technology
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesData.map((service) => (
              <Card key={service.id} className="border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl bg-white">
                <CardHeader>
                  <CardTitle className="text-xl text-[#1E3A5F]">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#64748B] leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-us" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1E3A5F] mb-4">Why Choose Us</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUsData.map((item, index) => (
              <div key={index} className="text-center p-6 rounded-2xl hover:bg-[#F8FAFC] transition-all">
                <div className="bg-gradient-to-br from-[#0EA5A4] to-[#16A34A] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                </div>
                <h3 className="text-lg font-semibold text-[#1E3A5F] mb-2">{item.title}</h3>
                <p className="text-[#64748B]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patient Reviews Section */}
      <section id="reviews" className="py-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1E3A5F] mb-4">Patient Reviews</h2>
            <p className="text-[#64748B]">What our patients say about their experience</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviewsData.map((review) => (
              <Card key={review.id} className="border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">{review.review}</p>
                  <div className="border-t pt-3">
                    <p className="font-semibold text-[#1E3A5F]">{review.name}</p>
                    <p className="text-sm text-[#64748B]">{review.date}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Clinic Gallery */}
      <section id="gallery" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1E3A5F] mb-4">Clinic Gallery</h2>
            <p className="text-[#64748B]">A glimpse of our modern facility in Nalasopara</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {galleryData.map((image) => (
              <div key={image.id} className="overflow-hidden rounded-2xl border-2 border-gray-200 hover:border-[#0EA5A4] transition-all shadow-md hover:shadow-xl">
                <img 
                  src={image.url} 
                  alt={`Dr Shukla Dental Clinic ${image.alt} - Best Dental Clinic in Nalasopara`}
                  className="w-full h-80 object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1E3A5F] mb-4">Frequently Asked Questions</h2>
            <p className="text-[#64748B]">Common questions about dental treatments and our services</p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq) => (
              <AccordionItem key={faq.id} value={`item-${faq.id}`} className="bg-white border-2 border-gray-200 rounded-xl px-6 hover:border-[#0EA5A4] transition-all">
                <AccordionTrigger className="text-left font-semibold text-[#1E3A5F] hover:text-[#0EA5A4]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[#64748B] leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1E3A5F] mb-4">Contact Us</h2>
            <p className="text-[#64748B]">Visit us or get in touch for appointments and consultations</p>
          </div>
          <div className="max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4 bg-[#F8FAFC] p-8 rounded-2xl">
                <h3 className="text-xl font-semibold text-[#1E3A5F] mb-4">Clinic Information</h3>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-[#0EA5A4] mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#1E3A5F]">Address</p>
                    <p className="text-[#64748B]">{clinicData.location.fullAddress}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-[#0EA5A4] mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#1E3A5F]">Phone</p>
                    <a href={`tel:${clinicData.contact.phone.replace(/\s/g, '')}`} className="text-[#0EA5A4] hover:text-[#16A34A] font-semibold">
                      {clinicData.contact.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-[#0EA5A4] mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#1E3A5F]">Working Hours</p>
                    <p className="text-[#64748B]">{clinicData.workingHours.weekdays}</p>
                    <p className="text-[#64748B]">{clinicData.workingHours.sunday}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center bg-gradient-to-br from-[#1E3A5F] to-[#0EA5A4] rounded-2xl p-8 text-white shadow-xl">
                <CalendarIcon className="w-16 h-16 text-white mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Book Your Appointment</h3>
                <p className="text-white/90 text-center mb-6">Schedule your visit online for a convenient experience</p>
                <Button onClick={() => setIsAppointmentModalOpen(true)} size="lg" className="bg-[#16A34A] hover:bg-emerald-700 text-white font-semibold shadow-lg">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  Book Appointment
                </Button>
              </div>
            </div>

            {/* Google Maps - 360 View + Normal Map */}
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <Button 
                  onClick={() => document.getElementById('map-360').classList.remove('hidden')} 
                  className="bg-[#0EA5A4] hover:bg-[#0E8A89]"
                >
                  View 360° Clinic Tour
                </Button>
              </div>

              {/* 360 Degree View Modal */}
              <div id="map-360" className="hidden fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                <div className="relative w-full max-w-6xl">
                  <button 
                    onClick={() => document.getElementById('map-360').classList.add('hidden')}
                    className="absolute -top-12 right-0 text-white text-xl bg-red-600 rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-700"
                  >
                    ✕
                  </button>
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!4v1771707185575!6m8!1m7!1s7FYG1PBsGrSUguPI-8CKzQ!2m2!1d19.41646530358503!2d72.82765012293994!3f97.53463!4f0!5f0.7820865974627469" 
                    width="100%" 
                    height="600" 
                    style={{border:0}} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-xl"
                  ></iframe>
                </div>
              </div>

              {/* Regular Map */}
              <div className="rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg">
                <iframe
                  src={clinicData.mapEmbedUrl}
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Dr Shukla Dental Clinic Location - Nalasopara, Palghar"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E3A5F] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">{clinicData.name}</h3>
              <p className="text-white/70">{clinicData.tagline}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-white/70">
                <p>{clinicData.contact.phone}</p>
                <p className="text-sm leading-relaxed">{clinicData.location.fullAddress}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Hours</h4>
              <div className="space-y-2 text-white/70">
                <p>{clinicData.workingHours.weekdays}</p>
                <p>{clinicData.workingHours.sunday}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-white/90 font-medium">Digital Structure AI</p>
            <p className="text-white/50 text-sm mt-1">Designed & Developed with Excellence</p>
          </div>
        </div>
      </footer>

      {/* Appointment Booking Modal */}
      <Dialog open={isAppointmentModalOpen} onOpenChange={setIsAppointmentModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#1E3A5F]">Book an Appointment</DialogTitle>
            <DialogDescription className="text-[#64748B]">
              Schedule your visit with Dr. {doctorData.name}. We'll confirm your appointment shortly.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAppointmentSubmit} className="space-y-6 mt-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="patient_name" className="text-sm font-medium text-[#1E3A5F]">
                Full Name <span className="text-[#DC2626]">*</span>
              </Label>
              <Input
                id="patient_name"
                name="patient_name"
                value={appointmentData.patient_name}
                onChange={handleAppointmentInputChange}
                placeholder="Enter your full name"
                required
                className="w-full border-gray-300 focus:border-[#0EA5A4] focus:ring-[#0EA5A4]"
              />
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-[#1E3A5F]">
                Phone Number <span className="text-[#DC2626]">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={appointmentData.phone}
                onChange={handleAppointmentInputChange}
                placeholder="Enter your phone number"
                required
                className="w-full border-gray-300 focus:border-[#0EA5A4] focus:ring-[#0EA5A4]"
              />
            </div>

            {/* Date Picker */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#1E3A5F]">
                Preferred Date <span className="text-[#DC2626]">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-gray-300 hover:border-[#0EA5A4]"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-[#0EA5A4]" />
                    {appointmentDate ? format(appointmentDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={appointmentDate}
                    onSelect={setAppointmentDate}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Slot Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="appointment_time" className="text-sm font-medium text-[#1E3A5F]">
                Preferred Time <span className="text-[#DC2626]">*</span>
              </Label>
              <Select
                value={appointmentData.appointment_time}
                onValueChange={(value) => setAppointmentData({ ...appointmentData, appointment_time: value })}
                required
              >
                <SelectTrigger className="w-full border-gray-300 hover:border-[#0EA5A4]">
                  <SelectValue placeholder="Select a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Message Field (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium text-[#1E3A5F]">
                Additional Notes <span className="text-[#64748B]">(Optional)</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                value={appointmentData.message}
                onChange={handleAppointmentInputChange}
                placeholder="Any specific concerns or questions?"
                rows={3}
                className="w-full border-gray-300 focus:border-[#0EA5A4] focus:ring-[#0EA5A4]"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAppointmentModalOpen(false)}
                className="flex-1 border-gray-300"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#16A34A] hover:bg-emerald-700 text-white font-semibold"
                disabled={!appointmentDate || !appointmentData.appointment_time || isSubmitting}
              >
                {isSubmitting ? 'Booking...' : 'Book Appointment'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
