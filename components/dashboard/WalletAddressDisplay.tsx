"use client";

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Copy, Check, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface WalletAddressDisplayProps {
  className?: string;
}

export function WalletAddressDisplay({ className }: WalletAddressDisplayProps) {
  const { address, isConnected } = useAccount();
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const truncateAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyToClipboard = async () => {
    if (!address) return;
    
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast({
        title: "Address Copied!",
        description: "Wallet address copied to clipboard",
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy address to clipboard",
        variant: "destructive",
      });
    }
  };

  if (!isConnected || !address) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={copyToClipboard}
      className={cn(
        "flex items-center space-x-2 h-8 px-3 text-xs font-mono hover:bg-muted/50 transition-colors",
        className
      )}
      title="Click to copy full address"
    >
      <Wallet className="h-3 w-3" />
      <span className="text-muted-foreground">
        {truncateAddress(address)}
      </span>
      {copied ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <Copy className="h-3 w-3 opacity-50" />
      )}
    </Button>
  );
}