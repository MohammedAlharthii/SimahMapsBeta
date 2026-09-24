import { PrismaClient, PropertyType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aqar-crm.com' },
    update: {},
    create: {
      email: 'admin@aqar-crm.com',
      name: 'مدير النظام',
      nameAr: 'مدير النظام',
      phone: '+966500000001',
      password: hashedPassword,
      role: 'SYSTEM_ADMIN',
      isActive: true,
    },
  });

  const salesManager = await prisma.user.upsert({
    where: { email: 'sales@aqar-crm.com' },
    update: {},
    create: {
      email: 'sales@aqar-crm.com',
      name: 'أحمد المبيعات',
      nameAr: 'أحمد المبيعات',
      phone: '+966500000002',
      password: hashedPassword,
      role: 'SALES_MANAGER',
      isActive: true,
    },
  });

  const propertyManager = await prisma.user.upsert({
    where: { email: 'property@aqar-crm.com' },
    update: {},
    create: {
      email: 'property@aqar-crm.com',
      name: 'سارة العقارات',
      nameAr: 'سارة العقارات',
      phone: '+966500000003',
      password: hashedPassword,
      role: 'PROPERTY_MANAGER',
      isActive: true,
    },
  });

  // Create sample owners
  const owner1 = await prisma.owner.create({
    data: {
      name: 'شركة الأمانة للتطوير العقاري',
      nameAr: 'شركة الأمانة للتطوير العقاري',
      email: 'info@alamana-dev.com',
      phone: '+966500000010',
      company: 'شركة الأمانة',
      type: 'DEVELOPER',
    },
  });

  const owner2 = await prisma.owner.create({
    data: {
      name: 'محمد العبدالله',
      nameAr: 'محمد العبدالله',
      email: 'mohammed@example.com',
      phone: '+966500000011',
      type: 'INDIVIDUAL',
    },
  });

  // Create sample project
  const project = await prisma.project.create({
    data: {
      name: 'Riyadh Heights',
      nameAr: 'أبراج الرياض',
      description: 'A luxury residential tower in the heart of Riyadh',
      descriptionAr: 'برج سكني فاخر في قلب الرياض',
      developer: 'شركة الأمانة للتطوير العقاري',
      status: 'UNDER_CONSTRUCTION',
      totalUnits: 120,
      completedUnits: 45,
      latitude: 24.7136,
      longitude: 46.6753,
      address: 'طريق الملك فهد، حي العليا',
      city: 'الرياض',
    },
  });

  // Create sample properties
  const properties = [
    {
      title: 'Modern Villa with Pool',
      titleAr: 'فيلا حديثة مع مسبح',
      description: 'A stunning modern villa with private pool, garden, and smart home system.',
      descriptionAr: 'فيلا حديثة مذهلة مع مسبح خاص وحديقة ونظام منزل ذكي.',
      type: 'VILLA' as const,
      status: 'AVAILABLE' as const,
      purpose: 'SALE' as const,
      price: 2500000,
      priceNegotiable: true,
      area: 450,
      bedrooms: 5,
      bathrooms: 4,
      floors: 2,
      yearBuilt: 2023,
      furnished: true,
      amenities: ['مسبح', 'حديقة', 'موقف سيارات', 'غرفة خادمة', 'مصعد', 'نظام ذكي'],
      latitude: 24.7136,
      longitude: 46.6753,
      address: 'حي العليا، شارع التحلية',
      addressAr: 'حي العليا، شارع التحلية',
      city: 'الرياض',
      district: 'العليا',
      country: 'SA',
      ownerId: owner1.id,
      createdById: propertyManager.id,
      isFeatured: true,
    },
    {
      title: 'Luxury Apartment Downtown',
      titleAr: 'شقة فاخرة وسط المدينة',
      description: 'Spacious 3-bedroom apartment with panoramic city views.',
      descriptionAr: 'شقة واسعة بثلاث غرف نوم مع إطلالة بانورامية على المدينة.',
      type: 'APARTMENT' as const,
      status: 'AVAILABLE' as const,
      purpose: 'SALE' as const,
      price: 850000,
      priceNegotiable: false,
      area: 150,
      bedrooms: 3,
      bathrooms: 2,
      floors: 1,
      yearBuilt: 2024,
      furnished: false,
      amenities: ['موقف سيارات', 'حراسة أمنية', 'نادي رياضي', 'حديقة مشتركة'],
      latitude: 24.7236,
      longitude: 46.6853,
      address: 'حي الملز، شارع صلاح الدين',
      addressAr: 'حي الملز، شارع صلاح الدين',
      city: 'الرياض',
      district: 'الملز',
      country: 'SA',
      ownerId: owner2.id,
      projectId: project.id,
      createdById: propertyManager.id,
      isFeatured: false,
    },
    {
      title: 'Commercial Office Space',
      titleAr: 'مكتب تجاري',
      description: 'Prime office space in business district with modern finishes.',
      descriptionAr: 'مساحة مكتبية متميزة في حي الأعمال بتشطيبات حديثة.',
      type: 'OFFICE' as const,
      status: 'AVAILABLE' as const,
      purpose: 'RENT' as const,
      price: 120000,
      priceNegotiable: true,
      area: 200,
      bedrooms: 0,
      bathrooms: 2,
      floors: 1,
      yearBuilt: 2022,
      furnished: true,
      amenities: ['موقف سيارات', 'حراسة', 'تكييف مركزي', 'إنترنت عالي السرعة'],
      latitude: 24.6936,
      longitude: 46.6553,
      address: 'حي الغدير، طريق الملك عبدالعزيز',
      addressAr: 'حي الغدير، طريق الملك عبدالعزيز',
      city: 'الرياض',
      district: 'الغدير',
      country: 'SA',
      ownerId: owner1.id,
      createdById: propertyManager.id,
      isFeatured: true,
    },
    {
      title: 'Residential Land Plot',
      titleAr: 'أرض سكنية',
      description: 'Large residential land plot in a developing area.',
      descriptionAr: 'أرض سكنية كبيرة في منطقة نامية.',
      type: 'LAND' as const,
      status: 'AVAILABLE' as const,
      purpose: 'SALE' as const,
      price: 500000,
      priceNegotiable: true,
      area: 600,
      bedrooms: 0,
      bathrooms: 0,
      floors: 0,
      amenities: ['شارع مسفلت', 'خدمات متوفرة', 'قريب من المسجد'],
      latitude: 24.6836,
      longitude: 46.7253,
      address: 'حي النرجس، شمال الرياض',
      addressAr: 'حي النرجس، شمال الرياض',
      city: 'الرياض',
      district: 'النرجس',
      country: 'SA',
      ownerId: owner2.id,
      createdById: propertyManager.id,
      isFeatured: false,
    },
    {
      title: 'Luxury Villa in Jeddah',
      titleAr: 'فيلا فاخرة في جدة',
      description: 'Sea-view luxury villa with private beach access.',
      descriptionAr: 'فيلا فاخرة بإطلالة بحرية مع وصول خاص للشاطئ.',
      type: 'VILLA' as const,
      status: 'AVAILABLE' as const,
      purpose: 'SALE' as const,
      price: 5000000,
      priceNegotiable: false,
      area: 800,
      bedrooms: 7,
      bathrooms: 6,
      floors: 3,
      yearBuilt: 2024,
      furnished: true,
      amenities: ['مسبح', 'حديقة', 'شاطئ خاص', 'مصعد', 'سينما منزلية', 'غرفة ألعاب'],
      latitude: 21.5433,
      longitude: 39.1728,
      address: 'حي الشاطئ، كورنيش جدة',
      addressAr: 'حي الشاطئ، كورنيش جدة',
      city: 'جدة',
      district: 'الشاطئ',
      country: 'SA',
      ownerId: owner1.id,
      createdById: propertyManager.id,
      isFeatured: true,
    },
  ];

  for (const prop of properties) {
    const property = await prisma.property.create({ data: prop });

    // Add sample images
    await prisma.propertyImage.createMany({
      data: [
        {
          url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
          alt: prop.title,
          order: 1,
          propertyId: property.id,
        },
        {
          url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
          alt: `${prop.title} - Interior`,
          order: 2,
          propertyId: property.id,
        },
      ],
    });
  }

  // Create sample clients
  const clients = [
    {
      name: 'خالد السعود',
      nameAr: 'خالد السعود',
      email: 'khaled@example.com',
      phone: '+966500000020',
      nationality: 'SA',
      source: 'WEBSITE' as const,
      status: 'QUALIFIED' as const,
      budget: 3000000,
      preferredType: PropertyType.VILLA,
      preferredCity: 'الرياض',
      notes: 'يبحث عن فيلا في شمال الرياض',
      assignedToId: salesManager.id,
    },
    {
      name: 'فاطمة الأحمد',
      nameAr: 'فاطمة الأحمد',
      email: 'fatima@example.com',
      phone: '+966500000021',
      nationality: 'SA',
      source: 'REFERRAL' as const,
      status: 'NEW' as const,
      budget: 1000000,
      preferredType: PropertyType.APARTMENT,
      preferredCity: 'الرياض',
      assignedToId: salesManager.id,
    },
    {
      name: 'عبدالله العمري',
      nameAr: 'عبدالله العمري',
      email: 'abdullah@example.com',
      phone: '+966500000022',
      nationality: 'SA',
      source: 'CAMPAIGN' as const,
      status: 'NEGOTIATING' as const,
      budget: 5000000,
      preferredType: PropertyType.VILLA,
      preferredCity: 'جدة',
      notes: 'مهتم بفيلا بحرية',
      assignedToId: salesManager.id,
    },
  ];

  for (const client of clients) {
    await prisma.client.create({ data: client });
  }

  // Create sample brokerage contract
  await prisma.brokerageContract.create({
    data: {
      ownerId: owner1.id,
      contractNumber: 'BRK-2024-001',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2025-12-31'),
      commissionRate: 2.5,
      status: 'ACTIVE',
      terms: 'عقد وساطة حصري لجميع عقارات شركة الأمانة في مدينة الرياض',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`  📧 Admin: admin@aqar-crm.com / admin123`);
  console.log(`  📧 Sales: sales@aqar-crm.com / admin123`);
  console.log(`  📧 Property: property@aqar-crm.com / admin123`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
