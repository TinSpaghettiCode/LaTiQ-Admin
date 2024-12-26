export async function PUT() {
  try {
    const crews = await prisma.persons.create({
      data: dummyPersonData,
    });

    return NextResponse.json(newPerson, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', details: error },
      { status: 500 }
    );
  }
}
