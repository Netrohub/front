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
  FileText,
  User,
  Calendar,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  Loader2,
  Download
} from 'lucide-react';
import { apiClient } from '@/lib/api';

interface AuditLog {
  id: number;
  user_id: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  action: string;
  entity_type: string;
  entity_id: number | null;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

interface AuditLogsResponse {
  data: AuditLog[];
  pagination: Pagination;
}

function AuditLogsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 50,
    total_pages: 1,
  });

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
      });

      const response = await apiClient.request<AuditLogsResponse>(`/audit-logs?${params}`);
      setAuditLogs(response.data || []);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (error: any) {
      console.error('Failed to fetch audit logs:', error);
      toast.error('Failed to load audit logs', {
        description: error.message || 'An error occurred while loading audit logs',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportLogs = async () => {
    try {
      setIsExporting(true);
      const response = await apiClient.request<AuditLog[]>('/audit-logs/export');
      
      // Create and download CSV
      const csv = convertToCSV(response.data);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('Audit logs exported', {
        description: 'Your audit logs have been downloaded successfully.',
      });
    } catch (error: any) {
      console.error('Failed to export audit logs:', error);
      toast.error('Failed to export audit logs', {
        description: error.message || 'An error occurred while exporting audit logs',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const convertToCSV = (logs: AuditLog[]): string => {
    const headers = ['ID', 'User', 'Action', 'Entity Type', 'Entity ID', 'IP Address', 'Created At'];
    const rows = logs.map(log => [
      log.id,
      log.user?.name || log.user?.email || 'Unknown',
      log.action,
      log.entity_type,
      log.entity_id || '',
      log.ip_address || '',
      new Date(log.created_at).toISOString(),
    ]);

    return [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
  };

  const handleViewLog = (logId: number) => {
    toast.info('Viewing log details', {
      description: `Opening log #${logId}`,
    });
  };

  const getActionBadge = (action: string) => {
    if (action.includes('create') || action.includes('Created')) {
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Created</Badge>;
    } else if (action.includes('update') || action.includes('Updated')) {
      return <Badge className="bg-blue-100 text-blue-800"><Info className="w-3 h-3 mr-1" />Updated</Badge>;
    } else if (action.includes('delete') || action.includes('Deleted')) {
      return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1" />Deleted</Badge>;
    } else if (action.includes('login') || action.includes('Logged')) {
      return <Badge className="bg-purple-100 text-purple-800"><Shield className="w-3 h-3 mr-1" />Login</Badge>;
    }
    return <Badge variant="secondary">{action}</Badge>;
  };

  const filteredLogs = auditLogs.filter(log => {
    const searchLower = searchTerm.toLowerCase();
    return (
      log.user?.name?.toLowerCase().includes(searchLower) ||
      log.user?.email?.toLowerCase().includes(searchLower) ||
      log.action?.toLowerCase().includes(searchLower) ||
      log.entity_type?.toLowerCase().includes(searchLower) ||
      log.ip_address?.toLowerCase().includes(searchLower)
    );
  });

  const totalLogs = pagination.total;
  const infoLogs = auditLogs.filter(l => !l.action.includes('error') && !l.action.includes('warning')).length;
  const warningLogs = auditLogs.filter(l => l.action.includes('warning') || l.action.includes('Failed')).length;
  const securityLogs = auditLogs.filter(l => l.action.includes('login') || l.action.includes('password')).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground">System activity and security logs</p>
        </div>
        <Button variant="outline" onClick={handleExportLogs} disabled={isExporting}>
          {isExporting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Logs</p>
              <p className="text-2xl font-bold">{totalLogs}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Info</p>
              <p className="text-2xl font-bold">{infoLogs}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">Warnings</p>
              <p className="text-2xl font-bold">{warningLogs}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Security</p>
              <p className="text-2xl font-bold">{securityLogs}</p>
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
              placeholder="Search audit logs..." 
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

      {/* Audit Logs Table */}
      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            No audit logs found
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{log.user?.name || 'Unknown'}</div>
                          <div className="text-sm text-muted-foreground">{log.user?.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.entity_type}</div>
                        {log.entity_id && (
                          <div className="text-sm text-muted-foreground">ID: {log.entity_id}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      <div className="text-sm">
                        {JSON.stringify(log.new_values || {}).slice(0, 100)}
                        {JSON.stringify(log.new_values || {}).length > 100 && '...'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {log.ip_address ? (
                        <span className="font-mono text-sm">{log.ip_address}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(log.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewLog(log.id)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchAuditLogs(pagination.page - 1)}
                    disabled={pagination.page === 1 || isLoading}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchAuditLogs(pagination.page + 1)}
                    disabled={pagination.page === pagination.total_pages || isLoading}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}

export default AuditLogsList;
