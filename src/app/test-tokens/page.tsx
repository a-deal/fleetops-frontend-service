'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export default function TestTokensPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-4xl font-bold mb-8 font-heading">Design Token System Test</h1>
      
      {/* Typography Test */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Typography with GT America + GT Pressura</CardTitle>
          <CardDescription>GT America for headings, GT Pressura for body text</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Body Text Sizes */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Body Text Sizes</h3>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Extra Small Text (12px) - DEPRECATED for accessibility</p>
              <p className="text-sm">Small Text (14px) - New minimum for captions/metadata</p>
              <p className="text-base">Base Text (16px) - Default body text</p>
              <p className="text-lg">Large Text (18px) - Emphasis or lead paragraphs</p>
            </div>
          </div>

          {/* Heading Sizes */}
          <div>
            <h3 className="text-lg font-semibold mb-3 font-heading">Heading Hierarchy (GT America)</h3>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold font-heading">H1: Dashboard Title (36px)</h1>
              <h2 className="text-3xl font-bold font-heading">H2: Section Header (30px)</h2>
              <h3 className="text-2xl font-semibold font-heading">H3: Card Title (24px)</h3>
              <h4 className="text-xl font-semibold font-heading">H4: Subsection (20px)</h4>
              <h5 className="text-lg font-medium font-heading">H5: Label (18px)</h5>
              <h6 className="text-base font-medium font-heading">H6: Small Label (16px)</h6>
            </div>
          </div>

          {/* Weight Variations */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Font Weights</h3>
            <div className="space-y-2">
              <p className="font-light">Light Weight (300)</p>
              <p className="font-normal">Normal Weight (400)</p>
              <p className="font-medium">Medium Weight (500)</p>
              <p className="font-semibold">Semibold Weight (600)</p>
              <p className="font-bold">Bold Weight (700)</p>
              <p className="font-extrabold">Extra Bold Weight (800)</p>
            </div>
          </div>

          {/* Data Table Example */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Data Context Example</h3>
            <div className="border rounded-lg p-4">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2 font-medium text-sm text-muted-foreground">Metric</th>
                    <th className="pb-2 font-medium text-sm text-muted-foreground">Value</th>
                    <th className="pb-2 font-medium text-sm text-muted-foreground">Change</th>
                  </tr>
                </thead>
                <tbody className="text-base">
                  <tr className="border-b">
                    <td className="py-2">Total Members</td>
                    <td className="py-2 font-medium">12,543</td>
                    <td className="py-2 text-success">+12.3%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Active Users</td>
                    <td className="py-2 font-medium">8,921</td>
                    <td className="py-2 text-error">-2.1%</td>
                  </tr>
                  <tr>
                    <td className="py-2">Revenue</td>
                    <td className="py-2 font-medium">$45,678</td>
                    <td className="py-2 text-success">+5.7%</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-sm text-muted-foreground mt-2">Table data at 16px base, headers at 14px</p>
            </div>
          </div>

          {/* Monospace Example */}
          <div>
            <h3 className="text-lg font-semibold mb-3 font-heading">Monospace Text (GT Pressura Mono)</h3>
            <div className="space-y-2">
              <code className="block p-4 bg-muted rounded-lg font-mono text-sm">
                const metrics = {`{`}<br />
                &nbsp;&nbsp;revenue: 45678.00,<br />
                &nbsp;&nbsp;members: 12543,<br />
                &nbsp;&nbsp;retention: 0.892<br />
                {`}`}
              </code>
              <p className="text-sm text-muted-foreground">Perfect for displaying data, IDs, and technical information</p>
            </div>
          </div>

          {/* Font Pairing Example */}
          <div>
            <h3 className="text-lg font-semibold mb-3 font-heading">Font Pairing in Context</h3>
            <div className="border rounded-lg p-4 space-y-2">
              <h4 className="text-xl font-semibold font-heading">Member Analytics</h4>
              <p className="text-base">Track key performance metrics across your gym locations. Monitor member engagement, revenue trends, and equipment utilization in real-time.</p>
              <div className="flex gap-4 mt-3">
                <Badge variant="secondary" className="font-mono">ID: GYM-2024-001</Badge>
                <Badge variant="outline">Last updated: 2 mins ago</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color System Test */}
      <Card>
        <CardHeader>
          <CardTitle>Color System</CardTitle>
          <CardDescription>OKLCH-based color tokens</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="space-y-2">
              <div className="w-24 h-24 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                Primary
              </div>
              <p className="text-sm text-muted-foreground">Brand Blue</p>
            </div>
            <div className="space-y-2">
              <div className="w-24 h-24 bg-secondary rounded-lg flex items-center justify-center text-secondary-foreground">
                Secondary
              </div>
              <p className="text-sm text-muted-foreground">Slate</p>
            </div>
            <div className="space-y-2">
              <div className="w-24 h-24 bg-success rounded-lg flex items-center justify-center text-white">
                Success
              </div>
              <p className="text-sm text-muted-foreground">Green</p>
            </div>
            <div className="space-y-2">
              <div className="w-24 h-24 bg-warning rounded-lg flex items-center justify-center text-black">
                Warning
              </div>
              <p className="text-sm text-muted-foreground">Amber</p>
            </div>
            <div className="space-y-2">
              <div className="w-24 h-24 bg-destructive rounded-lg flex items-center justify-center text-destructive-foreground">
                Error
              </div>
              <p className="text-sm text-muted-foreground">Red</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Component Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Component Examples</CardTitle>
          <CardDescription>Testing design tokens in action</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button>Primary Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>

          <Alert>
            <AlertTitle>Success Alert</AlertTitle>
            <AlertDescription>
              This uses our functional color tokens for success states.
            </AlertDescription>
          </Alert>

          <Alert className="border-warning bg-warning/10">
            <AlertTitle>Warning Alert</AlertTitle>
            <AlertDescription>
              This uses our functional color tokens for warning states.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Spacing Test */}
      <Card>
        <CardHeader>
          <CardTitle>Spacing System</CardTitle>
          <CardDescription>4px base unit spacing scale</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <span className="text-sm w-16">p-1</span>
              <div className="bg-primary/20 p-1">4px</div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm w-16">p-2</span>
              <div className="bg-primary/20 p-2">8px</div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm w-16">p-4</span>
              <div className="bg-primary/20 p-4">16px</div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm w-16">p-8</span>
              <div className="bg-primary/20 p-8">32px</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Border Radius Test */}
      <Card>
        <CardHeader>
          <CardTitle>Border Radius Tokens</CardTitle>
          <CardDescription>Consistent corner rounding</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="w-20 h-20 bg-primary/20 rounded-sm flex items-center justify-center text-xs">sm</div>
            <div className="w-20 h-20 bg-primary/20 rounded flex items-center justify-center text-xs">default</div>
            <div className="w-20 h-20 bg-primary/20 rounded-md flex items-center justify-center text-xs">md</div>
            <div className="w-20 h-20 bg-primary/20 rounded-lg flex items-center justify-center text-xs">lg</div>
            <div className="w-20 h-20 bg-primary/20 rounded-xl flex items-center justify-center text-xs">xl</div>
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-xs">full</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}