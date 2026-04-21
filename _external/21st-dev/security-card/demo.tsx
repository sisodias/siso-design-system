import SecurityCard from '@/components/ui/security-card';

export default function SecurityCardExample() {

  return (
    <SecurityCard
      delay={5000} // 5sec to again start the animation
      name="Liam Parker" // name to be displayed in the card
      email="liam.parker@example.com" //email to be displayed in the card
    />
  )
}