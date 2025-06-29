import { useState } from 'react';
import { Plus, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TechStackDialog } from './TechStackDialog';
import type { ElementType } from '@/types/elements';

interface ElementPaletteProps {
  onAddElement: (element: ElementType) => void;
}

export function ElementPalette({ onAddElement }: ElementPaletteProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [showTechStackDialog, setShowTechStackDialog] = useState(false);
  
  // Basic element types
  const basicElementTypes: {
    type: ElementType['type'];
    label: string;
    icon: React.ReactNode;
  }[] = [
    { type: 'header', label: 'Project Header', icon: '📝' },
    { type: 'text', label: 'Description', icon: '📄' },
    { type: 'badge', label: 'Badge', icon: '🏷️' },
    { type: 'installation', label: 'Installation', icon: '⚙️' },
    { type: 'code-block', label: 'Code Block', icon: '💻' },
    { type: 'table', label: 'Feature Table', icon: '📊' },
    { type: 'tech-stack', label: 'Tech Stack', icon: '🔧' },
    { type: 'git-contribution', label: 'Git Contribution', icon: '🐙' },
    { type: 'divider', label: 'Divider', icon: '➖' },
    { type: 'banner', label: 'Banner', icon: '📢' },
    { type: 'image', label: 'Image', icon: '🖼️' },
  ];
  
  // Advanced element types (GitHub API elements)
  const advancedElementTypes: {
    type: string;
    label: string;
    icon: React.ReactNode;
    category: string;
    template: string;
  }[] = [
    { 
      type: 'github-contribution-graph', 
      label: 'Contribution Graph', 
      icon: '📊', 
      category: 'graphs',
      template: 'https://github-readme-activity-graph.vercel.app/graph?username={username}&theme=react-dark&hide_border=false'
    },
    { 
      type: 'github-profile-summary', 
      label: 'Profile Summary', 
      icon: '📋', 
      category: 'graphs',
      template: 'https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username={username}&theme=radical'
    },
    { 
      type: 'github-stats-card', 
      label: 'Stats Card', 
      icon: '🎴', 
      category: 'stats',
      template: 'https://github-readme-stats.vercel.app/api?username={username}&show_icons=true&locale=en&theme=tokyonight'
    },
    { 
      type: 'github-language-stats', 
      label: 'Language Stats', 
      icon: '🌐', 
      category: 'languages',
      template: 'https://github-readme-stats.vercel.app/api/top-langs/?username={username}&layout=compact&theme=radical'
    },
    { 
      type: 'github-streak-stats', 
      label: 'Streak Stats', 
      icon: '🔥', 
      category: 'stats',
      template: 'https://github-readme-streak-stats.herokuapp.com/?user={username}&theme=dark&hide_border=true'
    },
    { 
      type: 'github-trophy', 
      label: 'GitHub Trophy', 
      icon: '🏆', 
      category: 'stats',
      template: 'https://github-profile-trophy.vercel.app/?username={username}&theme=onedark'
    },
  ];

  // The handleAddElement function stays mostly the same
  const handleAddElement = (type: ElementType['type'], label: string) => {
    const baseId = `${type}-${Date.now()}`;
    let newElement: ElementType;

    // ... existing code for creating basic elements ...
    switch (type) {
      case 'text':
        newElement = {
          id: baseId,
          type,
          content: `Sample ${label.toLowerCase()} content`,
          style: {
            fontSize: 'md',
            fontWeight: 'normal',
            textAlign: 'left',
            color: 'text-foreground',
          },
          hiddenFor: [],
        };
        break;
      // ... existing element cases ...
      case 'header':
        newElement = {
          id: baseId,
          type,
          content: `Sample ${label.toLowerCase()} content`,
          level: 2,
          hiddenFor: [],
        };
        break;
      case 'banner':
        newElement = {
          id: baseId,
          type,
          content: `Sample ${label.toLowerCase()} banner`,
          variant: 'default',
          color: 'blue',
          hiddenFor: [],
        };
        break;
      case 'badge':
        newElement = {
          id: baseId,
          type,
          content: `Sample badge`,
          variant: 'default',
          hiddenFor: [],
        };
        break;
      case 'code-block':
        newElement = {
          id: baseId,
          type,
          content: 'console.log("Hello world");',
          language: 'javascript',
          hiddenFor: [],
        };
        break;
      case 'table':
        newElement = {
          id: baseId,
          type,
          headers: ['Column 1', 'Column 2'],
          rows: [['Row 1 Col 1', 'Row 1 Col 2']],
          hiddenFor: [],
        };
        break;
      case 'tech-stack':
        newElement = {
          id: baseId,
          type,
          technologies: ['React', 'TypeScript'],
          layout: 'badges',
          hiddenFor: [],
        };
        break;
      case 'git-contribution':
        newElement = {
          id: baseId,
          type,
          username: 'your-username',
          repository: 'your-repo',
          hiddenFor: [],
        };
        break;
      case 'divider':
        newElement = {
          id: baseId,
          type,
          dividerStyle: 'line',
          hiddenFor: [],
        };
        break;
      case 'installation':
        newElement = {
          id: baseId,
          type,
          content: 'npm install your-package',
          hiddenFor: [],
        };
        break;
      case 'image':
        newElement = {
          id: baseId,
          type,
          src: 'https://example.com/image.png',
          alt: 'Example image',
          width: '100%',
          height: 'auto',
          hiddenFor: [],
        };
        break;
      default:
        throw new Error(`Unsupported element type: ${type}`);
    }

    onAddElement(newElement);
  };
  
  // Handler for advanced GitHub elements
  const handleAddAdvancedElement = (type: string, label: string, template: string) => {
    const baseId = `${type}-${Date.now()}`;
    
    // For advanced elements, we'll create them as image elements with GitHub API URLs
    const newElement: ElementType = {
      id: baseId,
      type: 'image',
      src: template.replace('{username}', 'your-username'),
      alt: label,
      width: '100%',
      height: 'auto',
      hiddenFor: [],
    };
    
    onAddElement(newElement);
  };

  return (
    <TooltipProvider>
      <div className="w-80 border-r border-border bg-muted/50 p-4 overflow-auto">
        <div className="mb-4">
          <h2 className="font-semibold text-lg mb-2">Element Palette</h2>
          <p className="text-sm text-muted-foreground">
            Drag elements to build your README
          </p>
        </div>
      
      {/* Tech Stack Dialog */}
      <TechStackDialog 
        isOpen={showTechStackDialog}
        onClose={() => setShowTechStackDialog(false)}
        onAddElement={onAddElement}
      />

      <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        {/* Basic Elements Tab */}
        <TabsContent value="basic" className="space-y-2">
          {basicElementTypes.map(({ type, label, icon }) => (
            <Tooltip key={type}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddElement(type, label)}
                  className={`w-full justify-start gap-3 h-auto py-3 ${
                    type === 'tech-stack' ? 'ring-2 ring-primary/50 bg-primary/5' : ''
                  }`}
                >
                  <span className="text-lg">{icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{label}</div>
                    <div className="text-xs text-muted-foreground capitalize">{type}</div>
                  </div>
                  <Plus className="h-4 w-4 opacity-50" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  {type === 'tech-stack' 
                    ? 'Add a basic tech stack list - for advanced features use the Advanced tab' 
                    : `Click to add a ${label.toLowerCase()} element`}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </TabsContent>
        
        {/* Advanced Elements Tab */}
        <TabsContent value="advanced" className="space-y-2">
          {/* Advanced Tech Stack Creator */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowTechStackDialog(true)}
                className="w-full justify-start gap-3 h-auto py-3 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <span className="text-lg">⚡</span>
                <div className="flex-1 text-left">
                  <div className="font-medium">Advanced Tech Stack</div>
                  <div className="text-xs text-white/80">Custom tech badges & styles</div>
                </div>
                <Code2 className="h-4 w-4 opacity-80" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                Create a tech stack with custom badge styles, themes, and layouts
              </div>
            </TooltipContent>
          </Tooltip>

          <div className="text-sm font-medium text-muted-foreground my-2 pt-2 border-t">
            GitHub Elements
          </div>
          
          {advancedElementTypes.map(({ type, label, icon, template }) => (
            <Tooltip key={type}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddAdvancedElement(type, label, template)}
                  className="w-full justify-start gap-3 h-auto py-3"
                >
                  <span className="text-lg">{icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{label}</div>
                    <div className="text-xs text-muted-foreground">GitHub API Element</div>
                  </div>
                  <Plus className="h-4 w-4 opacity-50" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  Click to add a {label.toLowerCase()} element (GitHub API)
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </TabsContent>
      </Tabs>
    </div>
    </TooltipProvider>
  );
}
