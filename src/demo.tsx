"use client";

import { useState } from "react";
import { Screen } from "./components/Screen";
import { Window } from "./components/Window";
import { Button, ButtonLink, Card, Spinner, Badge, Divider } from "./components/Primitives";
import { Header, Text } from "./components/Typography";
import { MenuDropdown, MenuItem, MenuDivider } from "./components/Menu";
import { Popover, Modal, Notification } from "./components/Overlays";
import { Select, Typeahead, MultiSelect, Input } from "./components/Form";
import tokens from "./tokens";

export default function BrutnoirOSDemoPage() {
    const [modalOpen, setModalOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [multiVal, setMultiVal] = useState(["Broadcast"]);
  const [selectVal, setSelectVal] = useState("");

  const dockApps = [
    { id: "ignite", title: "Ignite", icon: "🔥", description: "Campaign Sites", content: (
      <div style={{ padding: 20 }}>
        <Header level={3}>Ignite — Campaign Builder</Header>
        <Text muted style={{ marginTop: 8 }}>Launch high-converting campaign microsites in minutes.</Text>
        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          <Button variant="primary">New Campaign</Button>
          <Button>Import</Button>
        </div>
      </div>
    )},
    { id: "command", title: "Command", icon: "⚡", description: "Analytics", content: (
      <div style={{ padding: 20 }}>
        <Header level={3}>Command Center</Header>
        <Text muted style={{ marginTop: 8 }}>Real-time analytics and performance intelligence.</Text>
      </div>
    )},
    { id: "vault", title: "Vault", icon: "🗄️", description: "Assets", content: (
      <div style={{ padding: 20 }}>
        <Header level={3}>Asset Vault</Header>
        <Text muted style={{ marginTop: 8 }}>Centralized media and brand asset management.</Text>
      </div>
    )},
  ];
  return (
    <Screen
      dockApps={dockApps}
      menuItems={[{ label: "Tools", items: [{ label: "Open Ignite" }, { label: "Open Vault" }] }]}
    >
      {/* Component Showcase Window */}
      <Window id="showcase" title="NF/OS — Component Library" icon="✦" defaultX={60} defaultY={20} defaultWidth={640} defaultHeight={460}>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 20, background: tokens.colors.noir, height: "100%" }}>

          {/* Typography */}
          <div>
            <Header level={5} style={{ marginBottom: 8 }}>Typography</Header>
            <Header level={1}>Nameless Famous</Header>
            <Header level={2} accent>Neobrutal Noir</Header>
            <Text>Production-grade darkness. Every pixel earns its place.</Text>
            <Text muted mono size={11}>nf-os v1.0.0 · namelessfamous.com</Text>
          </div>

          <Divider label="Components" />

          {/* Buttons */}
          <div>
            <Header level={5} style={{ marginBottom: 8 }}>Buttons</Header>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <Button variant="primary" icon="✦">Primary</Button>
              <Button>Default</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="ghost">Ghost</Button>
              <Button disabled>Disabled</Button>
              <Badge variant="acid">New</Badge>
              <Badge variant="danger">Error</Badge>
              <ButtonLink href="#">Learn more →</ButtonLink>
            </div>
          </div>

          {/* Form */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Campaign Name" placeholder="e.g. Senate 2026" value={inputVal} onChange={e => setInputVal(e.target.value)} icon="✦" />
            <Select label="District" options={["KY-01","KY-02","KY-03","TN-07"]} value={selectVal} onChange={e => setSelectVal(e.target.value)} placeholder="Select district" />
            <Typeahead label="Search Candidates" options={["Adams, J","Baker, T","Clark, R","Davis, M"]} placeholder="Type to search…" />
            <MultiSelect label="Channels" options={["Digital","Broadcast","Direct Mail","OOH"]} value={multiVal} onChange={setMultiVal} />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Button variant="primary" onClick={() => setModalOpen(true)}>Open Modal</Button>
            <MenuDropdown trigger={<Button>Menu ▾</Button>}>
              <MenuItem icon="✦">New Project</MenuItem>
              <MenuItem icon="📁">Open…</MenuItem>
              <MenuDivider />
              <MenuItem icon="⚙">Settings</MenuItem>
              <MenuItem danger icon="✕">Delete</MenuItem>
            </MenuDropdown>
            <Popover title="Info" trigger={<Button>Popover</Button>}>
              <Text size={12}>NF/OS is the operating environment for Nameless Famous&apos;s creative suite.</Text>
            </Popover>
            <Spinner />
          </div>

          {/* Cards & Notifications */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Card accent>
              <Header level={4} style={{ marginBottom: 4 }}>Ignite</Header>
              <Text muted size={12}>48 active campaigns</Text>
            </Card>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <Notification title="Success" message="Campaign deployed successfully." variant="success" />
              <Notification title="Warning" message="Budget threshold reached." variant="warning" />
            </div>
          </div>
        </div>
      </Window>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Campaign"
        footer={<>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="primary">Create</Button>
        </>}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Text muted>Configure your new campaign&apos;s core settings.</Text>
          <Input label="Campaign Title" placeholder="e.g. Re-elect Senator Smith" />
          <Select label="Type" options={["Federal","State","Local","Initiative"]} placeholder="Select type" />
          <MultiSelect label="Channels" options={["Digital","Broadcast","Direct Mail","OOH","SMS"]} value={["Digital"]} onChange={() => {}} />
        </div>
      </Modal>
    </Screen>
   );
}