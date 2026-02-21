import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, MapPin, Clock, Star, Calendar as CalendarIcon } from 'lucide-react';
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
    window.location.href = `tel:+91${clinicData.contact.phone.replace(/\s/g, '')}`;
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${clinicData.contact.whatsapp}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Compact */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-semibold text-gray-900">{clinicData.name}</h2>
              <p className="text-xs text-gray-600">{clinicData.location.area}, {clinicData.location.city}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setIsAppointmentModalOpen(true)} size="sm" className="bg-emerald-600 hover:bg-emerald-700 font-semibold px-4">
                <CalendarIcon className="w-4 h-4 mr-1" />
                Book Now
              </Button>
              <Button onClick={handleCallNow} size="sm" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                <Phone className="w-3 h-3 mr-1" />
                Call
              </Button>
              <Button onClick={handleWhatsApp} size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                <MessageCircle className="w-3 h-3 mr-1" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Premium Gradient */}
      <section className="relative bg-gradient-to-br from-[#1E3A5F] via-[#2A5A7F] to-[#0EA5A4] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Dental Clinic in Nalasopara | Dr Shukla Dental Clinic
            </h1>
            <p className="text-lg text-white/90 mb-2">
              {doctorData.name}, {doctorData.qualifications}
            </p>
            <p className="text-sm text-white/80 mb-1">
              {doctorData.registration}
            </p>
            <p className="text-base text-white/90 mb-1">
              {doctorData.experience} of Clinical Experience | {doctorData.since}
            </p>
            <p className="text-base text-white/90 mb-1">
              ⭐ {clinicData.googleRating.stars} Google Rating from {clinicData.googleRating.reviews}+ Reviews
            </p>
            <p className="text-base text-white/90">
              <MapPin className="w-4 h-4 inline mr-1" />
              {clinicData.location.area}, {clinicData.location.city}
            </p>
          </div>
        </div>
      </section>

      {/* About Doctor Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src={doctorData.image} 
                alt={doctorData.name}
                className="rounded-lg w-full h-auto object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">About {doctorData.name}</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {doctorData.about}
              </p>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Advanced Training & Certifications:</h3>
                  <ul className="space-y-2">
                    {doctorData.advancedTraining.map((item, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Specialized In:</h3>
                  <ul className="space-y-2">
                    {doctorData.expertise.map((item, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Known For:</h3>
                  <ul className="space-y-2">
                    {doctorData.knownFor.map((item, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="text-blue-600 mr-2">✓</span>
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive dental care services delivered with professional expertise and modern technology
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesData.map((service) => (
              <Card key={service.id} className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUsData.map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patient Reviews Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Patient Reviews</h2>
            <p className="text-gray-600">What our patients say about their experience</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviewsData.map((review) => (
              <Card key={review.id} className="border-gray-200">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">{review.review}</p>
                  <div className="border-t pt-3">
                    <p className="font-semibold text-gray-900">{review.name}</p>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Clinic Gallery */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Clinic Gallery</h2>
            <p className="text-gray-600">A glimpse of our modern facility</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {galleryData.map((image) => (
              <div key={image.id} className="overflow-hidden rounded-lg border border-gray-200">
                <img 
                  src={image.url} 
                  alt={image.alt}
                  className="w-full h-80 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Common questions about dental treatments and our services</p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq) => (
              <AccordionItem key={faq.id} value={`item-${faq.id}`} className="bg-white border border-gray-200 rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600">Visit us or get in touch for appointments and consultations</p>
          </div>
          <div className="max-w-4xl mx-auto">
            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Clinic Information</h3>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Address</p>
                    <p className="text-gray-600">{clinicData.location.fullAddress}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-gray-600">+91 {clinicData.contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">{clinicData.contact.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Working Hours</p>
                    <p className="text-gray-600">{clinicData.workingHours.weekdays}</p>
                    <p className="text-gray-600">{clinicData.workingHours.sunday}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center bg-blue-50 rounded-lg p-8">
                <CalendarIcon className="w-16 h-16 text-blue-600 mb-4" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Book Your Appointment</h3>
                <p className="text-gray-600 text-center mb-6">Schedule your visit online for a convenient experience</p>
                <Button onClick={() => setIsAppointmentModalOpen(true)} size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  Book Appointment
                </Button>
              </div>
            </div>

            {/* Google Map */}
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <iframe
                src={clinicData.mapEmbedUrl}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Clinic Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">{clinicData.name}</h3>
              <p className="text-gray-400">{clinicData.tagline}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <p>+91 {clinicData.contact.phone}</p>
                <p>{clinicData.contact.email}</p>
                <p>{clinicData.location.area}, {clinicData.location.city}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Hours</h4>
              <div className="space-y-2 text-gray-400">
                <p>{clinicData.workingHours.weekdays}</p>
                <p>{clinicData.workingHours.sunday}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {clinicData.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Appointment Booking Modal */}
      <Dialog open={isAppointmentModalOpen} onOpenChange={setIsAppointmentModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Book an Appointment</DialogTitle>
            <DialogDescription className="text-gray-600">
              Schedule your visit with Dr. {doctorData.name}. We'll confirm your appointment shortly.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAppointmentSubmit} className="space-y-6 mt-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="patient_name" className="text-sm font-medium text-gray-900">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="patient_name"
                name="patient_name"
                value={appointmentData.patient_name}
                onChange={handleAppointmentInputChange}
                placeholder="Enter your full name"
                required
                className="w-full"
              />
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-900">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={appointmentData.phone}
                onChange={handleAppointmentInputChange}
                placeholder="Enter your phone number"
                required
                className="w-full"
              />
            </div>

            {/* Date Picker */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">
                Preferred Date <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
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
              <Label htmlFor="appointment_time" className="text-sm font-medium text-gray-900">
                Preferred Time <span className="text-red-500">*</span>
              </Label>
              <Select
                value={appointmentData.appointment_time}
                onValueChange={(value) => setAppointmentData({ ...appointmentData, appointment_time: value })}
                required
              >
                <SelectTrigger className="w-full">
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
              <Label htmlFor="message" className="text-sm font-medium text-gray-900">
                Additional Notes <span className="text-gray-500">(Optional)</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                value={appointmentData.message}
                onChange={handleAppointmentInputChange}
                placeholder="Any specific concerns or questions?"
                rows={3}
                className="w-full"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAppointmentModalOpen(false)}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
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
