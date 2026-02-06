import Image from 'next/image'

export default function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Image
        src="/logo.png"
        alt="Momento AI"
        width={40}
        height={40}
        priority
      />
      <strong style={{ fontSize: '18px' }}>Momento.AI</strong>
    </div>
  )
}
