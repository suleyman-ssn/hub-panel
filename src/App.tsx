import { useEffect, useState, useCallback } from 'react'
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Button,
  Statistic,
  Badge,
  Space,
  Spin,
  Menu,
  Table,
  Tag,
} from 'antd'
import {
  ShoppingCartOutlined,
  GiftOutlined,
  CarOutlined,
  AppstoreOutlined,
  ShopOutlined,
  TeamOutlined,
  DatabaseOutlined,
  ThunderboltOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LinkOutlined,
  ClockCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons'

const { Header, Content, Sider } = Layout
const { Title, Text } = Typography

const DARK = '#001529'
const BLUE = '#1677ff'

interface ChibbisStats {
  orders: { total: number; today: number; pending: number }
  products: { total: number; synced: number }
  syncLogs: { lastSync: string | null; errors: number }
}

interface FlowwowStats {
  totalOrders: number
  pendingOrders: number
  failedLogsLast24h: number
  sessionValid: boolean
  sessionLastUsed: string | null
  recentErrors?: { action: string; errorMessage: string; entityId: string; createdAt: string }[]
}

interface AggregateData {
  chibbis1: ChibbisStats | null
  chibbis2: ChibbisStats | null
  flowwow: FlowwowStats | null
}

function timeAgo(iso: string | null): string {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'только что'
  if (mins < 60) return `${mins} мин назад`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} ч назад`
  return `${Math.floor(hours / 24)} дн назад`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function StatusBadge({ ok, okText, failText }: { ok: boolean; okText: string; failText: string }) {
  return (
    <Badge
      status={ok ? 'success' : 'error'}
      text={<Text style={{ fontSize: 13 }}>{ok ? okText : failText}</Text>}
    />
  )
}

function NoData() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: '#bfbfbf' }}>
      <ExclamationCircleOutlined style={{ fontSize: 32, marginBottom: 12 }} />
      <br />
      <Text type="secondary">Нет данных — сервис недоступен</Text>
    </div>
  )
}

function ChibbisPanel({ data, url, loading }: { data: ChibbisStats | null; url: string; loading: boolean }) {
  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
  if (!data) return <NoData />

  const hasErrors = data.syncLogs.errors > 0

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 8 }}>
            <Statistic
              title="Всего заказов"
              value={data.orders.total}
              prefix={<ShoppingCartOutlined style={{ color: BLUE }} />}
              valueStyle={{ color: DARK, fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 8 }}>
            <Statistic
              title="Сегодня"
              value={data.orders.today}
              prefix={<ClockCircleOutlined style={{ color: BLUE }} />}
              valueStyle={{ color: DARK, fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 8 }}>
            <Statistic
              title="В работе"
              value={data.orders.pending}
              prefix={<WarningOutlined style={{ color: data.orders.pending > 0 ? '#fa8c16' : '#52c41a' }} />}
              valueStyle={{ color: data.orders.pending > 0 ? '#fa8c16' : DARK, fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 8 }}>
            <div style={{ marginBottom: 4 }}>
              <Text type="secondary" style={{ fontSize: 13 }}>Товаров</Text>
            </div>
            <div style={{ fontSize: 28, fontWeight: 600, color: DARK, marginBottom: 8 }}>{data.products.total}</div>
            <Space direction="vertical" size={2}>
              <StatusBadge ok={!hasErrors} okText="Ошибок нет" failText={`Ошибок: ${data.syncLogs.errors}`} />
              <Text style={{ fontSize: 11 }} type="secondary">Синхр: {timeAgo(data.syncLogs.lastSync)}</Text>
            </Space>
          </Card>
        </Col>
      </Row>

      <Button
        type="primary"
        size="large"
        icon={<LinkOutlined />}
        onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
        style={{ background: BLUE }}
      >
        Открыть панель
      </Button>
    </div>
  )
}

function FlowwowPanel({ data, url, loading }: { data: FlowwowStats | null; url: string; loading: boolean }) {
  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
  if (!data) return <NoData />

  const hasErrors = data.failedLogsLast24h > 0
  const errorsColumns = [
    { title: 'Заказ', dataIndex: 'entityId', key: 'entityId', width: 120 },
    { title: 'Действие', dataIndex: 'action', key: 'action', width: 160, render: (v: string) => <Text style={{ fontSize: 12 }}>{v}</Text> },
    { title: 'Ошибка', dataIndex: 'errorMessage', key: 'errorMessage', render: (v: string) => <Text style={{ fontSize: 12 }}>{v}</Text> },
    { title: 'Время', dataIndex: 'createdAt', key: 'createdAt', width: 120, render: (v: string) => <Text style={{ fontSize: 12 }}>{formatDate(v)}</Text> },
  ]

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 8 }}>
            <Statistic
              title="Всего заказов"
              value={data.totalOrders}
              prefix={<ShoppingCartOutlined style={{ color: BLUE }} />}
              valueStyle={{ color: DARK, fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 8 }}>
            <Statistic
              title="Ожидают МойСклад"
              value={data.pendingOrders}
              prefix={<ClockCircleOutlined style={{ color: data.pendingOrders > 0 ? '#fa8c16' : BLUE }} />}
              valueStyle={{ color: data.pendingOrders > 0 ? '#fa8c16' : DARK, fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 8 }}>
            <Statistic
              title="Ошибок за 24ч"
              value={data.failedLogsLast24h}
              prefix={<ExclamationCircleOutlined style={{ color: hasErrors ? '#ff4d4f' : '#52c41a' }} />}
              valueStyle={{ color: hasErrors ? '#ff4d4f' : DARK, fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 8 }}>
            <div style={{ marginBottom: 4 }}>
              <Text type="secondary" style={{ fontSize: 13 }}>Сессия Flowwow</Text>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Badge
                status={data.sessionValid ? 'success' : 'error'}
                text={<Text strong>{data.sessionValid ? 'Активна' : 'Истекла'}</Text>}
              />
            </div>
            <Text style={{ fontSize: 12 }} type="secondary">
              Последнее использование: {timeAgo(data.sessionLastUsed)}
            </Text>
          </Card>
        </Col>
      </Row>

      {data.recentErrors && data.recentErrors.length > 0 && (
        <Card
          title={<Text style={{ color: '#ff4d4f' }}>Последние ошибки</Text>}
          style={{ borderRadius: 8, marginBottom: 24 }}
          styles={{ body: { padding: 0 } }}
        >
          <Table
            dataSource={data.recentErrors}
            columns={errorsColumns}
            rowKey={(r) => r.createdAt}
            pagination={false}
            size="small"
          />
        </Card>
      )}

      <Button
        type="primary"
        size="large"
        icon={<LinkOutlined />}
        onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
        style={{ background: BLUE }}
      >
        Открыть панель
      </Button>
    </div>
  )
}

function LinkOnlyPanel({ url, description }: { url: string; description: string }) {
  return (
    <div>
      <Card style={{ borderRadius: 8, marginBottom: 24, maxWidth: 500 }}>
        <Text type="secondary">{description}</Text>
      </Card>
      <Button
        type="primary"
        size="large"
        icon={<LinkOutlined />}
        onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
        style={{ background: BLUE }}
      >
        Открыть панель
      </Button>
    </div>
  )
}

interface PanelDef {
  key: string
  label: string
  icon: React.ReactNode
  url: string
  description?: string
  type: 'chibbis' | 'flowwow' | 'link'
}

const PANELS: PanelDef[] = [
  { key: 'chibbis1',   label: 'Chibbis',           icon: <ShoppingCartOutlined />, url: 'https://soothing-insight-production-8757.up.railway.app/',      type: 'chibbis' },
  { key: 'chibbis2',   label: 'Chibbis (5 цветов)', icon: <ShoppingCartOutlined />, url: 'https://frontend-chibbis2-production.up.railway.app/',           type: 'chibbis' },
  { key: 'flowwow',    label: 'Flowwow',            icon: <GiftOutlined />,         url: 'https://zonal-curiosity-production-2157.up.railway.app/',        type: 'flowwow' },
  { key: 'yandex',     label: 'Яндекс.Еда + Купер', icon: <CarOutlined />,          url: 'http://89.104.71.21/warehouse/',        description: 'Управление заказами из Яндекс.Еда и Купер', type: 'link' },
  { key: 'flawery',    label: 'Флавери',            icon: <ShopOutlined />,         url: 'http://89.104.71.21/warehouse_flawery/', description: 'Склад и заказы для бренда Флавери',        type: 'link' },
  { key: 'kuper',      label: 'Купер',              icon: <AppstoreOutlined />,     url: 'http://89.104.71.21/warehouse_kuper/',  description: 'Заказы через платформу Купер',             type: 'link' },
  { key: 'letu',       label: 'Letu',               icon: <ThunderboltOutlined />,  url: 'http://89.104.71.21/warehouse_letu/',   description: 'Управление заказами через Letu',           type: 'link' },
  { key: 'turbocake',  label: 'TurboCake',          icon: <GiftOutlined />,         url: 'http://89.104.71.21/warehouse_cake/',   description: 'Заказы для TurboCake — торты и десерты',  type: 'link' },
  { key: 'orders',     label: 'Панель заказов',     icon: <TeamOutlined />,         url: 'http://89.104.71.21/panel/',            description: 'Общая панель всех входящих заказов',      type: 'link' },
  { key: 'erp',        label: 'ERP',                icon: <DatabaseOutlined />,     url: 'http://89.104.71.21/erp/',              description: 'Аналитика и управление ресурсами',         type: 'link' },
]

export default function App() {
  const [stats, setStats] = useState<AggregateData | null>(null)
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState('chibbis1')
  const [collapsed, setCollapsed] = useState(false)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/aggregate')
      setStats(await res.json())
    } catch { /* silent */ } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    const t = setInterval(fetchStats, 60000)
    return () => clearInterval(t)
  }, [fetchStats])

  const panel = PANELS.find((p) => p.key === active)!

  function renderContent() {
    if (panel.type === 'chibbis') {
      const data = active === 'chibbis1' ? stats?.chibbis1 : stats?.chibbis2
      return <ChibbisPanel data={data ?? null} url={panel.url} loading={loading} />
    }
    if (panel.type === 'flowwow') {
      return <FlowwowPanel data={stats?.flowwow ?? null} url={panel.url} loading={loading} />
    }
    return <LinkOnlyPanel url={panel.url} description={panel.description ?? ''} />
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          style={{ background: DARK, position: 'sticky', top: 0, height: '100vh', overflow: 'auto' }}
          width={210}
        >
          <div style={{ padding: collapsed ? '20px 8px' : '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            {!collapsed ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AppstoreOutlined style={{ color: BLUE, fontSize: 20 }} />
                <Text strong style={{ color: '#fff', fontSize: 15 }}>Панели</Text>
              </div>
            ) : (
              <AppstoreOutlined style={{ color: BLUE, fontSize: 20 }} />
            )}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[active]}
            style={{ background: DARK, borderRight: 0, marginTop: 8 }}
            items={PANELS.map((p) => ({
              key: p.key,
              icon: p.icon,
              label: p.label,
            }))}
            onClick={({ key }) => setActive(key)}
          />
        </Sider>

        <Layout>
          <Header
            style={{
              background: '#fff',
              borderBottom: '1px solid #f0f0f0',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'sticky',
              top: 0,
              zIndex: 9,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: DARK, fontSize: 18 }}>{panel.icon}</span>
              <Title level={4} style={{ margin: 0 }}>{panel.label}</Title>
              {panel.type !== 'link' && (
                <Tag color="blue" style={{ marginLeft: 4 }}>Live</Tag>
              )}
            </div>
            <Button
              size="small"
              icon={<ReloadOutlined spin={loading} />}
              onClick={fetchStats}
              disabled={loading || panel.type === 'link'}
            >
              Обновить
            </Button>
          </Header>

          <Content style={{ padding: '24px', background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
  )
}
