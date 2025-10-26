import React from 'react';
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
  Info
} from 'lucide-react';

function AuditLogsList() {
  // TODO: Replace with actual audit logs data from API
  const auditLogs = [];

  const handleExportLogs = () => {
    toast.success('Exporting audit logs...', {
      description: 'Your audit logs will be downloaded shortly.',
    });
    // TODO: Implement actual export functionality
  };

  const handleViewLog = (logId: string) => {
    toast.info('Viewing log details', {
      description: `Opening log #${logId}`,
    });
    // TODO: Navigate to log detail page
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'info':
        return <Badge className="bg-blue-100 text-blue-800"><Info className="w-3 h-3 mr-1" />Info</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" />Warning</Badge>;
      case 'success':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Success</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1" />Error</Badge>;
      default:
        return <Badge variant="secondary">{level}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground">System activity and security logs</p>
        </div>
        <Button variant="outline" onClick={handleExportLogs}>
          <FileText className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Info</p>
              <p className="text-2xl font-bold">1,234</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">Warnings</p>
              <p className="text-2xl font-bold">45</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Success</p>
              <p className="text-2xl font-bold">2,567</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Security</p>
              <p className="text-2xl font-bold">12</p>
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{log.user}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{log.action}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{log.resource}</div>
                    {log.resource_id && (
                      <div className="text-sm text-muted-foreground">ID: {log.resource_id}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {log.details}
                </TableCell>
                <TableCell>{getLevelBadge(log.level)}</TableCell>
                <TableCell>
                  <span className="font-mono text-sm">{log.ip_address}</span>
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
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

export default AuditLogsList;
