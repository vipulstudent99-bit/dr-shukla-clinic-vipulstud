import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Loader2, CheckCircle, XCircle, Trash2, Lock } from 'lucide-react';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(null);

  const ADMIN_PASSWORD = 'drshukla2024';

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Access denied.');
      setPassword('');
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching appointments:', error);
        alert('Failed to fetch appointments: ' + error.message);
      } else {
        setAppointments(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An error occurred while fetching appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAppointments();
    }
  }, [isAuthenticated]);

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdating(id);
    try {
      // Use .select() to verify the update was actually applied
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating status:', error);
        alert('Failed to update status: ' + error.message);
      } else if (!data || data.length === 0) {
        // Update returned no rows - likely RLS policy blocking the update
        console.error('Update returned no data - RLS policy may be blocking updates');
        alert('Update failed: You may not have permission to update this appointment. Please check Supabase RLS policies.');
      } else {
        alert(`Appointment ${newStatus} successfully!`);
        // Refetch fresh data from database
        await fetchAppointments();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An error occurred while updating status.');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    setUpdating(id);
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting appointment:', error);
        alert('Failed to delete appointment: ' + error.message);
      } else {
        alert('Appointment deleted successfully!');
        // Refetch fresh data from database
        await fetchAppointments();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An error occurred while deleting appointment.');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'confirmed') {
      return <Badge className="bg-green-500">Confirmed</Badge>;
    } else if (status === 'cancelled') {
      return <Badge className="bg-red-500">Cancelled</Badge>;
    } else {
      return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Password Protection Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Lock className="w-6 h-6" />
              Admin Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Admin Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full"
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                )}
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Access Admin Panel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <Button 
              onClick={() => setIsAuthenticated(false)} 
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Appointment Requests</CardTitle>
            <Button 
              onClick={fetchAppointments} 
              disabled={loading}
              variant="outline"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refresh'}
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No appointments found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">
                          {appointment.patient_name}
                        </TableCell>
                        <TableCell>{appointment.phone}</TableCell>
                        <TableCell>{formatDate(appointment.appointment_date)}</TableCell>
                        <TableCell>{appointment.appointment_time}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {appointment.message || '-'}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(appointment.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {appointment.status !== 'confirmed' && (
                              <Button
                                size="sm"
                                onClick={() => handleUpdateStatus(appointment.id, 'confirmed')}
                                disabled={updating === appointment.id}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                {updating === appointment.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Confirm
                                  </>
                                )}
                              </Button>
                            )}
                            {appointment.status !== 'cancelled' && (
                              <Button
                                size="sm"
                                onClick={() => handleUpdateStatus(appointment.id, 'cancelled')}
                                disabled={updating === appointment.id}
                                variant="outline"
                                className="border-red-600 text-red-600 hover:bg-red-50"
                              >
                                {updating === appointment.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Cancel
                                  </>
                                )}
                              </Button>
                            )}
                            <Button
                              size="sm"
                              onClick={() => handleDelete(appointment.id)}
                              disabled={updating === appointment.id}
                              variant="outline"
                              className="border-gray-600 text-gray-600 hover:bg-gray-50"
                            >
                              {updating === appointment.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
