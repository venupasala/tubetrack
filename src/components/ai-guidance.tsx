import { Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AiGuidanceProps {
  guidance: string;
}

export default function AiGuidance({ guidance }: AiGuidanceProps) {
  if (!guidance) return null;

  return (
    <Card className="bg-primary/10 border-primary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Lightbulb className="w-6 h-6" />
          <span>AI-Powered Guidance</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg text-primary-foreground/90">{guidance}</p>
      </CardContent>
    </Card>
  );
}
