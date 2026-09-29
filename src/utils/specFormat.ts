import { AdminHostingPlan } from '../types';

/**
 * Standard unit formatter for RAM specifications
 * Examples: '4' -> '4 GB', '4GB' -> '4 GB', '4 GB DDR5' -> '4 GB DDR5'
 */
export function formatRamSpec(val?: string | number | null): string {
  if (val === undefined || val === null) return 'N/A';
  const str = String(val).trim();
  if (!str) return 'N/A';

  // Pure number check: e.g. '4' or 4 -> '4 GB'
  if (/^\d+(?:\.\d+)?$/.test(str)) {
    return `${str} GB`;
  }

  // Number followed immediately by gb/mb/tb: e.g. '4gb' or '4GB DDR5'
  const match = str.match(/^(\d+(?:\.\d+)?)\s*(gb|mb|tb|g|m|t)\b(.*)$/i);
  if (match) {
    const num = match[1];
    let unit = match[2].toUpperCase();
    if (unit === 'G') unit = 'GB';
    if (unit === 'M') unit = 'MB';
    if (unit === 'T') unit = 'TB';
    const rest = match[3].trim();
    return rest ? `${num} ${unit} ${rest}` : `${num} ${unit}`;
  }

  return str;
}

/**
 * Standard unit formatter for CPU specifications
 * Examples: '2' -> '2 vCPU', '2 vcpu' -> '2 vCPU', '4 vCPU EPYC' -> '4 vCPU EPYC'
 */
export function formatCpuSpec(val?: string | number | null): string {
  if (val === undefined || val === null) return 'N/A';
  const str = String(val).trim();
  if (!str) return 'N/A';

  // Pure number check: e.g. '2' or 2 -> '2 vCPU'
  if (/^\d+$/.test(str)) {
    return `${str} vCPU`;
  }

  // Matches '2 vcpu' or '2 cores' or '2cpu'
  const match = str.match(/^(\d+)\s*(?:vcpu|vcpus|v-cpu|core|cores|cpu|cpus)\b(.*)$/i);
  if (match) {
    const num = match[1];
    const rest = match[2].trim();
    return rest ? `${num} vCPU ${rest}` : `${num} vCPU`;
  }

  return str;
}

/**
 * Standard unit formatter for Disk/Storage specifications
 * Examples: '80' -> '80 GB', '80GB' -> '80 GB', '80 GB NVMe' -> '80 GB NVMe'
 */
export function formatDiskSpec(val?: string | number | null): string {
  if (val === undefined || val === null) return 'N/A';
  const str = String(val).trim();
  if (!str) return 'N/A';

  // Pure number check: e.g. '80' -> '80 GB'
  if (/^\d+(?:\.\d+)?$/.test(str)) {
    return `${str} GB`;
  }

  // Matches '80gb' or '80 GB NVMe SSD'
  const match = str.match(/^(\d+(?:\.\d+)?)\s*(gb|mb|tb|g|m|t)\b(.*)$/i);
  if (match) {
    const num = match[1];
    let unit = match[2].toUpperCase();
    if (unit === 'G') unit = 'GB';
    if (unit === 'M') unit = 'MB';
    if (unit === 'T') unit = 'TB';
    const rest = match[3].trim();
    return rest ? `${num} ${unit} ${rest}` : `${num} ${unit}`;
  }

  return str;
}

/**
 * Extract concise short unit for badge or mobile view (e.g. '2 vCPU', '4 GB', '80 GB')
 */
export function extractShortSpec(spec: string, type: 'cpu' | 'ram' | 'disk'): string {
  if (!spec || spec === 'N/A') return 'N/A';

  if (type === 'ram') {
    const m = spec.match(/(\d+(?:\.\d+)?\s*(?:GB|MB|TB))/i);
    if (m) return m[1].toUpperCase();
    return spec.split(' ')[0] + ' GB';
  }

  if (type === 'cpu') {
    const m = spec.match(/(\d+)\s*(?:vCPU|vCPUs|Cores?|CPU)/i);
    if (m) return `${m[1]} vCPU`;
    // Check for EPYC/Xeon core format: '64C/128T'
    const cMatch = spec.match(/(\d+)C\/\d+T/i);
    if (cMatch) return `${cMatch[1]} vCPU`;
    return spec;
  }

  if (type === 'disk') {
    const m = spec.match(/(\d+(?:\.\d+)?\s*(?:GB|TB|MB))/i);
    if (m) return m[1].toUpperCase();
    return spec;
  }

  return spec;
}

export interface PlanSpecifications {
  cpu: string;
  shortCpu: string;
  ram: string;
  shortRam: string;
  disk: string;
  shortDisk: string;
  bandwidth: string;
  network?: string;
  ddos?: string;
}

/**
 * Extracts and normalizes RAM, CPU, and Disk/Storage directly from actual plan data
 * Resolves across first-class plan properties, customSpecs, and disk/storage aliases
 */
export function getPlanSpecs(plan?: AdminHostingPlan | null): PlanSpecifications {
  if (!plan) {
    return {
      cpu: 'N/A',
      shortCpu: 'N/A',
      ram: 'N/A',
      shortRam: 'N/A',
      disk: 'N/A',
      shortDisk: 'N/A',
      bandwidth: 'N/A',
      network: 'N/A',
      ddos: 'N/A'
    };
  }

  // 1. Resolve CPU
  let rawCpu = plan.cpu;
  if (!rawCpu || !rawCpu.trim()) {
    const specFound = plan.customSpecs?.find(s => /cpu|processor|vcore|core/i.test(s.label));
    if (specFound && specFound.value.trim()) {
      rawCpu = specFound.value;
    }
  }
  const formattedCpu = formatCpuSpec(rawCpu);

  // 2. Resolve RAM
  let rawRam = plan.ram;
  if (!rawRam || !rawRam.trim()) {
    const specFound = plan.customSpecs?.find(s => /ram|memory/i.test(s.label));
    if (specFound && specFound.value.trim()) {
      rawRam = specFound.value;
    }
  }
  const formattedRam = formatRamSpec(rawRam);

  // 3. Resolve Disk/Storage
  let rawDisk = plan.storage || plan.disk;
  if (!rawDisk || !rawDisk.trim()) {
    const specFound = plan.customSpecs?.find(s => /storage|disk|nvme|ssd|hdd|space/i.test(s.label));
    if (specFound && specFound.value.trim()) {
      rawDisk = specFound.value;
    }
  }
  const formattedDisk = formatDiskSpec(rawDisk);

  // Bandwidth & Other Specs
  const bandwidth = plan.bandwidth || plan.customSpecs?.find(s => /bandwidth|traffic/i.test(s.label))?.value || 'Unmetered';
  const network = plan.network || plan.customSpecs?.find(s => /network|uplink|port/i.test(s.label))?.value || '';
  const ddos = plan.ddos || plan.customSpecs?.find(s => /ddos|mitigation|protection/i.test(s.label))?.value || '';

  return {
    cpu: formattedCpu,
    shortCpu: extractShortSpec(formattedCpu, 'cpu'),
    ram: formattedRam,
    shortRam: extractShortSpec(formattedRam, 'ram'),
    disk: formattedDisk,
    shortDisk: extractShortSpec(formattedDisk, 'disk'),
    bandwidth: bandwidth.trim() ? bandwidth : 'N/A',
    network: network.trim() ? network : undefined,
    ddos: ddos.trim() ? ddos : undefined
  };
}
