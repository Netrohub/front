import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye,
  Ticket,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { apiClient } from '@/lib/api';

interface TicketType {
  id: number;
  user_id: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  subject: string;
  message: string;
  status: string;
  priority: string;
  category: string | null;
  assigned_to: number | null;
  assigned_admin?: {
    id: number;
    name: string;
    email: string;
  };
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

function TicketsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.request<TicketType[]>('/tickets');
      setTickets(response.data || []);
    } catch (error: any) {
      console.error('Failed to fetch tickets:', error);
      toast.error('Failed to load tickets', {
        description: error.message || 'An error occurred while loading tickets',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewTicket = () => {
    toast.info('New Ticket', {
      description: 'Opening ticket creation form...',
    });
  };

  const handleUpdateStatus = async (ticketId: number, status: string) => {
    try {
      setIsProcessing(true);
      await apiClient.request(`/tickets/${ticketId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      
      toast.success('Ticket updated', {
        description: `Ticket status updated to ${status}`,
      });
      
      await fetchTickets();
    } catch (error: any) {
      console.error('Failed to update ticket:', error);
      toast.error('Failed to update ticket', {
        description: error.message || 'An error occurred while updating ticket',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewTicket = (ticketId: number) => {
    toast.info('Viewing ticket', {
      description: `Opening ticket #${ticketId}`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Open</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Resolved</Badge>;
      case 'closed':
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge className="bg-red-100 text-red-800">Urgent</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const searchLower = searchTerm.toLowerCase();
    return (
      ticket.subject?.toLowerCase().includes(searchLower) ||
      ticket.user?.name?.toLowerCase().includes(searchLower) ||
      ticket.user?.email?.toLowerCase().includes(searchLower) ||
      ticket.category?.toLowerCase().includes(searchLower)
    );
  });

  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
  const totalTickets = tickets.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Support Tickets</h1>
          <p className="text-muted-foreground">Manage customer support tickets</p>
        </div>
        <Button onClick={handleNewTicket} disabled={isProcessing}>
          {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-sm text-muted-foreground">Open</p>
              <p className="text-2xl font-bold">{openTickets}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold">{inProgressTickets}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Resolved</p>
              <p className="text-2xl font-bold">{resolvedTickets}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{totalTickets}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search tickets..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Tickets Table */}
      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            No tickets found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">#{ticket.id}</div>
                      <div className="text-sm text-muted-foreground max-w-[200px] truncate">
                        {ticket.subject}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{ticket.user?.name || `User #${ticket.user_id}`}</div>
                      <div className="text-muted-foreground">{ticket.user?.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                  <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                  <TableCell>{ticket.category || '-'}</TableCell>
                  <TableCell>{ticket.assigned_admin?.name || '-'}</TableCell>
                  <TableCell>
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewTicket(ticket.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {ticket.status === 'open' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleUpdateStatus(ticket.id, 'in_progress')}
                          disabled={isProcessing}
                        >
                          {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}

export default TicketsList;
