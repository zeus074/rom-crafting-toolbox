import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import {
  RomType, 
  FillType, 
  RomSegment, 
  RomProject,
  ROM_SIZES, 
  createBlankSegment, 
  readFileAsUint8Array, 
  downloadFile, 
  saveProject, 
  loadProject
} from '@/lib/romUtils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Download, 
  Upload, 
  FilePlus, 
  Save, 
  FolderOpen, 
  Trash2,
} from 'lucide-react';

import RomSelector from '@/components/RomSelector';
import SegmentList from '@/components/SegmentList';
import HexEditor from '@/components/HexEditor';
import RomUsageStats from '@/components/RomUsageStats';
import BlankSpaceSelector from '@/components/BlankSpaceSelector';
import FileDropzone from '@/components/FileDropzone';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/lib/languageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Index = () => {
  const { t } = useLanguage();
  
  const [projectName, setProjectName] = useState<string>('Untitled Project');
  const [romType, setRomType] = useState<RomType>('27C256');
  const [fillType, setFillType] = useState<FillType>(0xFF);
  
  const [segments, setSegments] = useState<RomSegment[]>([]);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  
  const [showDropzone, setShowDropzone] = useState<boolean>(false);
  
  const selectedSegment = segments.find(segment => segment.id === selectedSegmentId) || null;
  
  const handleRomTypeChange = (newType: RomType) => {
    setRomType(newType);
  };
  
  const handleFillTypeChange = (newFillType: string) => {
    setFillType(Number(newFillType) as FillType);
  };
  
  const handleFilesSelected = async (files: File[]) => {
    setShowDropzone(false);
    
    try {
      const newSegments: RomSegment[] = [];
      
      for (const file of files) {
        const data = await readFileAsUint8Array(file);
        
        newSegments.push({
          id: uuidv4(),
          name: file.name,
          type: 'file',
          size: data.length,
          data
        });
      }
      
      setSegments(prev => [...prev, ...newSegments]);
      
      if (newSegments.length > 0) {
        setSelectedSegmentId(newSegments[0].id);
      }
      
      toast.success(
        files.length > 1 
          ? `${files.length} ROM files added` 
          : `ROM file "${files[0].name}" added`
      );
    } catch (error) {
      console.error(t('err.loading.rom'), error);
      toast.error(t('failed.load.rom'));
    }
  };
  
  const handleAddBlankSpace = (size: number, fillPattern: FillType) => {
    const blankData = createBlankSegment(size, fillPattern);
    const sizeLabel = size >= 1024 ? `${size / 1024}KB` : `${size}B`;
    
    const newSegment: RomSegment = {
      id: uuidv4(),
      name: `${t('blank.space')} (${sizeLabel})`,
      type: 'blank',
      size,
      data: blankData
    };
    
    setSegments(prev => [...prev, newSegment]);
    setSelectedSegmentId(newSegment.id);
    
    toast.success(`${t('added')} ${sizeLabel} ${t('blank.space.filled')} ${fillPattern ? '0xFF' : '0x00'}`);
  };
  
  const handleSelectSegment = (id: string) => {
    setSelectedSegmentId(id);
  };
  
  const handleRemoveSegment = (id: string) => {
    setSegments(prev => prev.filter(segment => segment.id !== id));
    
    if (selectedSegmentId === id) {
      setSelectedSegmentId(segments.length > 1 ? segments[0].id : null);
    }
    
    toast.success(t('segment.removed'));
  };
  
  const handleMoveSegment = (id: string, direction: 'up' | 'down') => {
    setSegments(prev => {
      const index = prev.findIndex(segment => segment.id === id);
      
      if (index === -1) {
        return prev;
      }
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (newIndex < 0 || newIndex >= prev.length) {
        return prev;
      }
      
      const newSegments = [...prev];
      const segment = newSegments[index];
      
      newSegments.splice(index, 1);
      
      newSegments.splice(newIndex, 0, segment);
      
      return newSegments;
    });
  };
  
  const handleExport = () => {
    try {
      const romSize = ROM_SIZES[romType];
      const totalData = segments.reduce((acc, segment) => {
        const newAcc = new Uint8Array(acc.length + segment.data.length);
        newAcc.set(acc);
        newAcc.set(segment.data, acc.length);
        return newAcc;
      }, new Uint8Array(0));
      
      const romCount = Math.ceil(totalData.length / romSize);
      
      if (romCount === 0) {
        toast.error(t('no.data.export'));
        return;
      }
      
      if (romCount === 1) {
        const romFile = new Uint8Array(romSize);
        romFile.fill(fillType);
        romFile.set(totalData);
        
        downloadFile(romFile, `${projectName.replace(/\s+/g, '_')}.bin`);
        toast.success(t('export.success'));
      } else {
        for (let i = 0; i < romCount; i++) {
          const romFile = new Uint8Array(romSize);
          romFile.fill(fillType);
          
          const start = i * romSize;
          const end = Math.min(start + romSize, totalData.length);
          const slice = totalData.slice(start, end);
          
          romFile.set(slice);
          
          downloadFile(
            romFile, 
            `${projectName.replace(/\s+/g, '_')}_part${(i + 1).toString().padStart(2, '0')}.bin`
          );
        }
        
        toast.success(`Exported ${romCount} ROM files successfully`);
      }
    } catch (error) {
      console.error(t('error.export.rom'), error);
      toast.error(t('failed.export.rom'));
    }
  };
  
  const handleSaveProject = () => {
    try {
      const project: RomProject = {
        name: projectName,
        romType,
        fillType,
        segments
      };
      
      const json = saveProject(project);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName.replace(/\s+/g, '_')}.romproj`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(t('project.saved'));
    } catch (error) {
      console.error(t('error.project.save'), error);
      toast.error(t('failed.project.save'));
    }
  };
  
  const handleLoadProject = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const project = loadProject(text);
      
      setProjectName(project.name);
      setRomType(project.romType);
      setFillType(project.fillType);
      setSegments(project.segments);
      
      if (project.segments.length > 0) {
        setSelectedSegmentId(project.segments[0].id);
      } else {
        setSelectedSegmentId(null);
      }
      
      toast.success(`Project "${project.name}" loaded successfully`);
    } catch (error) {
      console.error(t('error.project.load'), error);
      toast.error(t('failed.project.load'));
    }
  }, []);
  
  const handleSelectProjectFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.romproj,application/json';
    
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      
      if (target.files && target.files.length > 0) {
        await handleLoadProject(target.files[0]);
      }
    };
    
    input.click();
  };
  
  const handleResetProject = () => {
    if (segments.length === 0) {
      return;
    }
    
    const confirmed = window.confirm(t('delete.confirm'));
    
    if (confirmed) {
      setProjectName('Untitled Project');
      setRomType('27C256');
      setFillType(0xFF);
      setSegments([]);
      setSelectedSegmentId(null);
      
      toast.success('Project reset');
    }
  };
  
  useEffect(() => {
    document.title = `${projectName} - ROM Creator`;
  }, [projectName]);
  
  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold tracking-tight">
                ROM Creator <a href="https://retrofixer.it" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">by Retrofixer</a>
              </h1>
              <p className="text-sm text-muted-foreground">{t('app.description')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <Button variant="outline" size="sm" onClick={handleSelectProjectFile}>
              <FolderOpen size={16} className="mr-2" />
              {t('load')}
            </Button>
            <Button variant="outline" size="sm" onClick={handleSaveProject}>
              <Save size={16} className="mr-2" />
              {t('save')}
            </Button>
            <Button variant="outline" size="sm" onClick={handleResetProject}>
              <Trash2 size={16} className="mr-2" />
              {t('reset')}
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="p-4 border rounded-md space-y-4 bg-card">
              <h2 className="font-semibold text-lg">{t('project.settings')}</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">{t('project.name')}</label>
                <Input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder={t('project.name.placeholder')}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <RomSelector value={romType} onChange={handleRomTypeChange} />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t('fill.pattern')}</label>
                  <Select value={String(fillType)} onValueChange={handleFillTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('fill.pattern')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0x00 ({t('zeros')})</SelectItem>
                      <SelectItem value="255">0xFF ({t('ones')})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <RomUsageStats romType={romType} segments={segments} />
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowDropzone(prev => !prev)}
              >
                <FilePlus size={16} className="mr-2" />
                {t('add.rom.files')}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleExport}
                disabled={segments.length === 0}
              >
                <Download size={16} className="mr-2" />
                {t('export.rom')}
              </Button>
            </div>
            
            {showDropzone && (
              <div className="animate-scale-in">
                <FileDropzone onFilesSelected={handleFilesSelected} />
              </div>
            )}
            
            <BlankSpaceSelector onAddBlankSpace={handleAddBlankSpace} />
            
            <div className="space-y-4">
              <h2 className="font-semibold">{t('rom.segments')} {segments.length > 0 && `(${segments.length})`}</h2>
              <SegmentList
                segments={segments}
                selectedSegmentId={selectedSegmentId}
                onSelectSegment={handleSelectSegment}
                onRemoveSegment={handleRemoveSegment}
                onMoveSegment={handleMoveSegment}
              />
            </div>
          </div>
          
          <div className="lg:col-span-8">
            <div className="p-4 border rounded-md bg-card h-full">
              <h2 className="font-semibold text-lg mb-4">
                {selectedSegment 
                  ? `Viewing: ${selectedSegment.name}`
                  : t('rom.content.viewer')
                }
              </h2>
              
              {selectedSegment ? (
                <HexEditor segment={selectedSegment} />
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <p className="text-lg mb-2">{t('no.segment.selected')}</p>
                  <p>{t('select.segment')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t mt-12 py-6 text-center text-sm text-muted-foreground">
        <div className="container">
          <p>ROM Creator &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
