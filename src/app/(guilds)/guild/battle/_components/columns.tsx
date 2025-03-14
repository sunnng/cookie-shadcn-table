'use client'

import type { GuildBattleRecords } from '@/db/schemas/guild'
import type { DataTableRowAction } from '@/types'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { guildBattleRecords } from '@/db/schemas/guild'
import { getErrorMessage } from '@/lib/handle-error'
import { formatDate } from '@/lib/utils'
import { Ellipsis } from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'

import { updateTask } from '../_lib/actions'

interface GetColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<GuildBattleRecords> | null>
  >
}

export function getColumns({
  setRowAction,
}: GetColumnsProps): ColumnDef<GuildBattleRecords>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
            || (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'participantName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="玩家名称" />
      ),
      cell: ({ row }) => <div className="w-20">{row.getValue('participantName')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'bossType',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="BOSS" />
      ),
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.bossType}</Badge>
      ),
    },
    {
      accessorKey: 'damage',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="伤害" />
      ),
      cell: ({ row }) => <div className="w-20">{row.getValue('damage')}</div>,
    },
    {
      accessorKey: 'combatPower',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="战斗力" />
      ),
      cell: ({ row }) => <div className="w-20">{row.getValue('damage')}</div>,
    },
    {
      accessorKey: 'participationTime',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="讨伐时间" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<Date>()),
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        const [isUpdatePending, startUpdateTransition] = React.useTransition()

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex size-8 p-0 data-[state=open]:bg-muted"
              >
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, type: 'update' })}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={row.original.bossType}
                    onValueChange={(value) => {
                      startUpdateTransition(() => {
                        toast.promise(
                          updateTask({
                            id: row.original.id,
                            label: value as GuildBattleRecords['bossType'],
                          }),
                          {
                            loading: 'Updating...',
                            success: 'Label updated',
                            error: err => getErrorMessage(err),
                          },
                        )
                      })
                    }}
                  >
                    {guildBattleRecords.bossType.enumValues.map(bossType => (
                      <DropdownMenuRadioItem
                        key={bossType}
                        value={bossType}
                        className="capitalize"
                        disabled={isUpdatePending}
                      >
                        {bossType}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, type: 'delete' })}
              >
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      size: 40,
    },
  ]
}
