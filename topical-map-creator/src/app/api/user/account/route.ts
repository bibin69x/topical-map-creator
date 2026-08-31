import { NextResponse } from 'next/server';
import { executeAccountDeletion, UserAccountDataStore } from '@/lib/services/account';

export const dynamic = 'force-dynamic';

// In-memory reference store for runtime operations
const memoryStore: UserAccountDataStore = {
  projects: [],
  generations: [],
  payments: [],
  profiles: [],
  entitlements: []
};

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'mock-current-user';

    const result = executeAccountDeletion(userId, memoryStore);

    return NextResponse.json({
      success: true,
      message: 'User account and associated project entities permanently deleted.',
      data: result
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Account deletion failed' },
      { status: 400 }
    );
  }
}
