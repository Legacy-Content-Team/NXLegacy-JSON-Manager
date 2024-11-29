import React, { useState } from 'react';
import { Save } from 'lucide-react';
import type { GameData, GameLink, Update, DLC } from '../types';
import BaseGameSection from './BaseGameSection';
import DlcPackSection from './DlcPackSection';
import UpdatesSection from './UpdatesSection';
import DlcsSection from './DlcsSection';

interface GameFormProps {
  id?: string;
  onSave: (data: GameData) => void;
  initialData?: GameData;
}

export default function GameForm({ id, onSave, initialData }: GameFormProps) {
  const [baseId, setBaseId] = useState('');
  const [version, setVersion] = useState(() => {
    if (initialData?.base?.version !== undefined) {
      return initialData.base.version.toString();
    }
    return '0';
  });
  
  React.useEffect(() => {
    if (initialData?.base?.id) {
      setBaseId(initialData.base.id);
    }
  }, [initialData?.base?.id]);
  
  React.useEffect(() => {
    if (initialData?.base?.version !== undefined) {
      setVersion(initialData.base.version.toString());
    }
  }, [initialData?.base?.version]);
  
  const [baseLinks, setBaseLinks] = useState<GameLink>(initialData?.base?.links || {});
  const [hasDlcPack, setHasDlcPack] = useState(!!initialData?.dlc_pack);
  const [dlcPackLinks, setDlcPackLinks] = useState<GameLink>(initialData?.dlc_pack?.links || {});
  const [updates, setUpdates] = useState<Update[]>(initialData?.updates || []);
  const [dlcs, setDlcs] = useState<DLC[]>(initialData?.dlcs || []);
  
  React.useEffect(() => {
    if (initialData?.dlcs) {
      setDlcs(initialData.dlcs.map(dlc => ({
      ...dlc,
      version: dlc.version?.toString() || '0',
      addedDate: dlc.addedDate || dlc.added_date || new Date().toISOString()
      })));
    }
  }, [initialData?.dlcs]);
  
  React.useEffect(() => {
    if (initialData?.base?.links) {
      setBaseLinks(initialData.base.links);
    }
  }, [initialData?.base?.links]);
  
  React.useEffect(() => {
    if (initialData?.dlc_pack) {
      setHasDlcPack(true);
      setDlcPackLinks(initialData.dlc_pack.links);
    }
  }, [initialData?.dlc_pack]);
  
  React.useEffect(() => {
    if (initialData?.updates) {
      setUpdates(initialData.updates);
    }
  }, [initialData?.updates]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: GameData = {
      base: {
        id: baseId,
        version: parseInt(version, 10),
        links: baseLinks,
        addedDate: new Date().toISOString(),
      },
      updates,
      dlcs: dlcs,
    };

    if (hasDlcPack) {
      data.dlc_pack = {
        links: dlcPackLinks,
        addedDate: new Date().toISOString(),
      };
    }

    onSave(data);
  };

  return (
    <form id={id} onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <BaseGameSection
          baseId={baseId}
          setBaseId={setBaseId}
          version={version}
          setVersion={setVersion}
          links={baseLinks}
          setLinks={setBaseLinks}
        />
        
        <DlcPackSection
          enabled={hasDlcPack}
          setEnabled={setHasDlcPack}
          links={dlcPackLinks}
          setLinks={setDlcPackLinks}
        />

        <UpdatesSection
          updates={updates}
          setUpdates={setUpdates}
          baseId={baseId}
        />

        <DlcsSection
          dlcs={dlcs}
          setDlcs={setDlcs}
        />
      </div>
    </form>
  );
}