import {
  AnimatedCard,
  CardBody,
  CardDescription,
  CardTitle,
  CardVisual,
} from "@/components/ui/animated-card-chart"
import { Visual3 } from "@/components/ui/animated-card-chart"

export default function AnimatedCard3Demo() {
  return (
    <AnimatedCard>
      <CardVisual>
        <Visual3 mainColor="#ff6900" secondaryColor="#f54900" />
      </CardVisual>
      <CardBody>
        <CardTitle>Just find the right caption</CardTitle>
        <CardDescription>
          This card will tell everything you want
        </CardDescription>
      </CardBody>
    </AnimatedCard>
  )
}
